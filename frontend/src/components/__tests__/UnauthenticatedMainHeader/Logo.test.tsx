import { render, screen } from "@testing-library/react";
import Logo from "@/components/(shared)/Logo";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router-dom";

describe("Logo", () => {
  it("renders application name - OpenMeet", () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );
    expect(screen.getByText("OpenMeet")).toBeInTheDocument();
  });
});
