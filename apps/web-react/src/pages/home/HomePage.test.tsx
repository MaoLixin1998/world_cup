import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("greets the current fan and shows the world cup qa entry", () => {
    render(<HomePage fanName="小梅迷" />);

    expect(screen.getByRole("heading", { name: "世界杯问答" })).toBeInTheDocument();
    expect(screen.getByText(/小梅迷，用中文提问/)).toBeInTheDocument();
  });
});
