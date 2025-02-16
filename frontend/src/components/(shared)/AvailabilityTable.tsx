import { forwardRef } from "react";

interface Props {
  value: boolean[][];
}

const AvailabilityTable = forwardRef<HTMLTableElement, Props>(
  ({ value }, ref) => {
    return (
      //   <div className="flex w-full">
      <table ref={ref} className="flex flex-col">
        <thead className="flex-grow">
          <tr className="flex">
            <th className="size-14 grow">Mon</th>
            <th className="size-14 grow">Tue</th>
            <th className="size-14 grow">Wed</th>
          </tr>
        </thead>
        <tbody className="flex">
          {value.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`flex flex-col grow`}
              onClick={() => {
                console.log("clicked");
              }}
            >
              <th>{rowIndex + 1}</th>
              {row.map((_, columnIndex) => (
                <td
                  key={columnIndex}
                  className={`border-x border-y border-gray-200 border-dashed size-6 w-full
                    ${
                      value[rowIndex][columnIndex] ? "bg-sky-500" : "bg-white"
                    }`}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      //   </div>
    );
  }
);

export default AvailabilityTable;
