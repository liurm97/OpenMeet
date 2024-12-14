import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import { TIME_PICKER_OPTIONS } from "@/utils/globals";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatCalendarDate, formatCalendarTime } from "@/utils/formatter";
import { createEvent } from "@/services/api/api";
import { useNavigate } from "react-router-dom";

type CreateEventFormProp = {
  className: string;
};

enum EventType {
  SPECIFIC_DATES = 1,
  DAYS_OF_THE_WEEK = 2,
}

// const dateArrayZod = z.array(z.date().or(z.string())).nonempty({ message: "Select dates for event" })
// Form validation schema
const formSchema = z
  .object({
    eventName: z.string().min(1, {
      message: "Event name required",
    }),
    startTime: z.string().time({ message: "Start time required" }),
    endTime: z.string().time({ message: "End time required" }),
    eventDateType: z.number(),
    eventDates: z.union([
      z.string().array().nonempty("At least one day required"),
      z.date().array().nonempty("At least one date required"),
    ]),
  })
  .refine((data) => data.startTime <= data.endTime, {
    message: "Start time must be earlier than End time",
    path: ["startTime"], // path of error
  });

const CreateEventForm = ({ className }: CreateEventFormProp) => {
  const [eventType, setEventType] = useState<EventType>(
    EventType.SPECIFIC_DATES
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  console.log(eventType.toString());
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      startTime: "09:00:00",
      endTime: "17:00:00",
      eventDateType: eventType == EventType.SPECIFIC_DATES ? 1 : 2,
      eventDates: [],
    },
  });

  // Handle onsubmit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // set to loading
    setIsLoading(true);

    console.log("submitted");

    // format event payload
    let createEventPayload;
    let formattedDates;
    try {
      console.log(values);
      const { eventName, startTime, endTime, eventDateType, eventDates } =
        values;

      const startTimeUTC = formatCalendarTime(startTime);
      const endTimeUTC = formatCalendarTime(endTime);

      if (eventDateType == 1) {
        const dates = eventDates;

        formattedDates = dates.map((_date) => {
          const formattedDate = formatCalendarDate(_date as Date, startTime);
          return {
            date: formattedDate,
          };
        });
      } else if (eventDateType == 2) {
        const dates = eventDates;

        formattedDates = dates.map((_date) => {
          return {
            dayOfWeek: _date,
          };
        });
      }
      createEventPayload = {
        name: eventName,
        type: eventDateType,
        startTime: startTimeUTC,
        endTime: endTimeUTC,
        eventDates: formattedDates,
      };

      const createEventResponse = await createEvent(createEventPayload);
      const { status, data } = createEventResponse;
      console.log(
        `createEventResponse:: ${JSON.stringify(createEventResponse)}`
      );
      if (status == 200) {
        const { id }: { id: string } = data;
        setIsLoading(false);
        navigate(`/events/${id}`);
      } else if (status == 404) {
        setIsLoading(false);
        navigate("/");
      }

      console.log(`createEventPayload:: ${JSON.stringify(createEventPayload)}`);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`${className}`}>
        {/* -------- Event name -------- */}
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event name</FormLabel>
              <FormControl>
                <Input placeholder="Name your event..." type="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* -------- Start time -------- */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="9 am" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIME_PICKER_OPTIONS.map((val, ind) => (
                        <SelectItem key={`startTime${ind}`} value={val.value}>
                          {val.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* -------- End time -------- */}
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="5 pm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIME_PICKER_OPTIONS.map((val, ind) => (
                        <SelectItem key={`endTime${ind}`} value={val.value}>
                          {val.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* -------- Date type -------- */}
        <FormField
          control={form.control}
          name="eventDateType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What dates are you available?</FormLabel>
              <Select
                onValueChange={(newVal: string) => {
                  if (Number(newVal) == 1)
                    setEventType(EventType.SPECIFIC_DATES);
                  else setEventType(EventType.DAYS_OF_THE_WEEK);
                  field.onChange(Number(newVal));
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Specific dates" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EventType.SPECIFIC_DATES.toString()}>
                    Specific dates
                  </SelectItem>
                  <SelectItem value={EventType.DAYS_OF_THE_WEEK.toString()}>
                    Days of the week
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {eventType == EventType.SPECIFIC_DATES ? (
          <FormField
            control={form.control}
            name="eventDates"
            render={({ field }) => (
              <FormItem className="flex flex-col mx-auto">
                <Calendar
                  mode="multiple"
                  selected={field.value as Date[]}
                  onSelect={(val) => field.onChange(val)}
                  initialFocus
                />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="eventDates"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <ToggleGroup
                  type="multiple"
                  size="sm"
                  variant={"outline"}
                  onSelect={field.onChange}
                  onValueChange={(val) => {
                    field.onChange(val);
                  }}
                >
                  <ToggleGroupItem value="Monday" aria-label="Monday">
                    Mon
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Tuesday" aria-label="Tuesday">
                    Tues
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Wednesday" aria-label="Wednesday">
                    Wed
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Thursday" aria-label="Thursday">
                    Thurs
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Friday" aria-label="Friday">
                    Fri
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Saturday" aria-label="Saturday">
                    Sat
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Sunday" aria-label="Sunday">
                    Sun
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormItem>
            )}
          />
        )}
        {/* -------- Event Dates -------- */}
        {isLoading ? (
          <Button disabled className="w-full mt-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Event...
          </Button>
        ) : (
          <Button type="submit" variant="default" className="w-full mt-4">
            Create Event
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CreateEventForm;
