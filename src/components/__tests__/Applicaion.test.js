import React from "react";
import { render, waitForElement, fireEvent, getByText, prettyDOM, getByPlaceholderText, getByAltText } from "@testing-library/react";
import Application from "components/Application";


describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"))
      .then(() => {
        //fire a click
        fireEvent.click(getByText("Tuesday"));
        expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();
      });
  });



  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, getAllByTestId, debug} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const allArticles = getAllByTestId("appointment");
    const appointment = allArticles[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, /save/i));

    expect(getByText(container, /saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const allDays = getAllByTestId("day");
    const monday = allDays.find(day => {
      return getByText(day, "Monday");
    });

    console.log(prettyDOM(monday));
  });
});