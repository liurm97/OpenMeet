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

type CreateEventFormProp = {
  className: string;
};

enum EventType {
  SPECIFIC_DATES = 1,
  DAYS_OF_THE_WEEK = 2,
}

// const dateArrayZod = z.array(z.date().or(z.string())).nonempty({ message: "Select dates for event" })
// Form validation schema
const formSchema = z.object({
  eventName: z.string().min(1, {
    message: "Event name required",
  }),
  startTime: z.string().time({ message: "Start time required" }),
  endTime: z.string().time({ message: "End time required" }),
  eventDateType: z.string(),
  eventDates: z.union([
    z.string().array().nonempty("At least one day required"),
    z.date().array().nonempty("At least one date required"),
  ]),
  //  z
  //   .array(z.date().or(z.array(z.string())))
  //   .nonempty({ message: "Select dates for event" }),
});

const CreateEventForm = ({ className }: CreateEventFormProp) => {
  const [eventType, setEventType] = useState<EventType>(
    EventType.SPECIFIC_DATES
  );

  console.log(eventType.toString());
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      startTime: "09:00:00",
      endTime: "17:00:00",
      eventDateType: eventType == EventType.SPECIFIC_DATES ? "1" : "2",
      eventDates: [],
    },
  });

  // Handle onsubmit
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(form.formState.errors);
    console.log("submitted");
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
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
                  if (newVal == "1") setEventType(EventType.SPECIFIC_DATES);
                  else setEventType(EventType.DAYS_OF_THE_WEEK);
                  field.onChange(newVal);
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
              <FormItem className="flex flex-col">
                <Calendar
                  mode="multiple"
                  selected={field.value as Date[]}
                  onSelect={field.onChange}
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateEventForm;
