import React from "react";
import { render, waitForElement, fireEvent, getByText, prettyDOM, getByPlaceholderText, getByAltText, queryByText, getAllByText } from "@testing-library/react";
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
    const { container, getAllByTestId } = render(<Application />);
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

    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();
  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    const { container, debug, getAllByTestId } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId("appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const allDays = getAllByTestId("day");
    const monday = allDays.find(day => {
      return getByText(day, "Monday");
    });

    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    const { container, debug, getAllByTestId } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId("appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));

    expect(getByPlaceholderText(appointment, "Enter Student Name")).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Chris DReyes" }
    });

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Delete"));

    const allDays = getAllByTestId("day");
    const monday = allDays.find(day => {
      return getByText(day, "Monday");
    });

    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();

  });
});