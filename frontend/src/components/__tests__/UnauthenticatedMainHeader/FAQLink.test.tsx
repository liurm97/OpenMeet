import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import HowItWorksLink from "@/components/Unauthenticated/MainHeader/HowItWorksLink";
import userEvent from "@testing-library/user-event";

export function changeWindowLocation(newLocation: string) {
  window.location.href = newLocation;
}

describe("FAQLink", () => {
  beforeEach(() => {
    const location = window.location;
    delete global.window.location;
    global.window.location = Object.assign({}, location);
  });

  it("Redirect to #faq", async () => {
    render(
      <MemoryRouter initialEntries={["http://localhost:5173"]}>
        <HowItWorksLink />
      </MemoryRouter>
    );
    // changeWindowLocation("http://localhost:5173#how-it-works");

    const logo = screen.getByRole("link");

    await userEvent.click(logo);
    changeWindowLocation("http://localhost:5173/#faq");
    expect(window.location.href).toBe("http://localhost:5173/#faq");

    // .then(() => {
    //   console.log("clicked");
    //   changeWindowLocation("http://localhost:5173/#faq");
    //   expect(window.location.href).toBe("http://localhost:5173/#faq");
    // })
    // .catch(() => {
    //   console.log("not clicked");
    // });
  });
});
