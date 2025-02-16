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
import {
  formatCalendarDateUTC,
  formatCalendarTimeUTC,
} from "@/utils/formatter";
import { createEvent } from "@/services/api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { EventDate, EventDay } from "@/types/type";

type CreateEventFormProp = {
  className: string;
};

enum EventType {
  SPECIFIC_DATES = 1,
  DAYS_OF_THE_WEEK = 2,
}

// Form validation schema
const formSchema = z.object({
  eventName: z.string().min(1, {
    message: "Event name required",
  }),
  startTime: z.string().time({ message: "Start time required" }),
  endTime: z.string().time({ message: "End time required" }),
  eventDateType: z.number(),
  eventDates: z.union([
    z.string().array().nonempty(),
    z.date().array().nonempty(),
  ]),
});

const CreateEventForm = ({ className }: CreateEventFormProp) => {
  const auth = useAuth();
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
      eventDateType: 1,
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
    let formattedDates: EventDate[] | undefined;
    let formattedDays: EventDay[] | undefined;
    let owner: string | undefined;
    try {
      console.log(values);

      /* 1. destructure form field values */
      const { eventName, startTime, endTime, eventDateType, eventDates } =
        values;

      /* 2. format form field values */

      // id value
      const random_event_id = crypto.randomUUID();
      console.log(`random_event_id:: ${random_event_id}`);

      // convert startTime and endTime to UTC
      const startTimeUTC = formatCalendarTimeUTC(startTime);
      const endTimeUTC = formatCalendarTimeUTC(endTime);

      console.log(startTimeUTC);
      console.log(endTimeUTC);

      // owner value
      if (auth.isSignedIn === false) {
        owner = "-1";
      } else {
        owner = auth.userId!;
      }
      console.log(`owner:: ${owner}`);

      // If SPECIFIC_dates: EventDates value
      const dates = eventDates;
      if (eventDateType == 1) {
        formattedDates = dates.map((_date) => {
          const formattedDate = formatCalendarDateUTC(_date as Date, startTime);
          console.log(formattedDate);
          return {
            date: formattedDate,
          };
        });

        createEventPayload = {
          id: random_event_id,
          name: eventName,
          owner: owner,
          type: eventDateType,
          start_time_utc: startTimeUTC,
          end_time_utc: endTimeUTC,
          eventDates: formattedDates,
        };
      }
      // If DAY_OF_WEEK: EventDays value
      else if (eventDateType == 2) {
        formattedDays = dates.map((_date) => {
          return {
            day: _date,
          };
        });

        createEventPayload = {
          id: random_event_id,
          name: eventName,
          owner: owner,
          type: eventDateType,
          start_time_utc: startTimeUTC,
          end_time_utc: endTimeUTC,
          eventDays: formattedDays,
        };
      }

      console.log(`createEventPayload:: ${JSON.stringify(createEventPayload)}`);
      const createEventResponse = await createEvent(createEventPayload!);
      const { status, data } = createEventResponse;
      console.log(`status:: ${status}`);
      console.log(
        `createEventResponse:: ${JSON.stringify(createEventResponse)}`
      );
      if (status == 201) {
        const { id }: { id: string } = data;
        console.log(`id:: ${id}`);
        setIsLoading(false);
        navigate(`/event/${id}`);
      } else if (status == 500 || status == 400) {
        setIsLoading(false);
        navigate("/");
      }
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
          render={({ field }) => {
            console.log(`field:: ${JSON.stringify(field)}`);
            return (
              <FormItem>
                <FormLabel>What dates are you available?</FormLabel>
                <Select
                  onValueChange={(newVal: string) => {
                    console.log(`newVal:: ${newVal}`);
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
            );
          }}
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
                  max={5}
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
                  variant={"default"}
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
