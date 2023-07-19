import React from "react";
import Button from "components/Button";
import { render, fireEvent} from '@testing-library/react'

it("renders its `children` prop as text", () => {
  const { getByText } = render(<Button>Default</Button>);
  expect(getByText("Default")).toBeInTheDocument();
});