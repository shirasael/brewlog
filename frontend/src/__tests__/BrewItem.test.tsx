import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BrewItem from "../components/BrewItem";

describe("BrewItem delete functionality", () => {
  const mockOnDelete = jest.fn();
  const defaultProps = {
    id: 1,
    beanType: "Ethiopian Yirgacheffe",
    imageUrl: null,
    brewType: "V60",
    waterTemp: 94,
    weightIn: 18,
    weightOut: 270,
    brewTime: "03:00",
    bloomTime: 30,
    details: "Test details",
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows delete confirmation when delete button is clicked", () => {
    render(<BrewItem {...defaultProps} />);

    const deleteButton = screen.getByLabelText("Delete brew");
    fireEvent.click(deleteButton);

    expect(screen.getByText("Delete Brew")).toBeInTheDocument();
    expect(
      screen.getByText(
        `Are you sure you want to delete your ${defaultProps.beanType} brew? This action cannot be undone.`,
      ),
    ).toBeInTheDocument();
  });

  it("calls onDelete when deletion is confirmed", () => {
    render(<BrewItem {...defaultProps} />);

    // Click delete button to show confirmation
    fireEvent.click(screen.getByLabelText("Delete brew"));

    // Confirm deletion
    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.id);
  });

  it("does not call onDelete when deletion is cancelled", () => {
    render(<BrewItem {...defaultProps} />);

    // Click delete button to show confirmation
    fireEvent.click(screen.getByLabelText("Delete brew"));

    // Cancel deletion
    fireEvent.click(screen.getByTestId("cancel-button"));

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it("shows delete confirmation on sufficient swipe", () => {
    render(<BrewItem {...defaultProps} />);

    const brewItem = screen.getByTestId("brew-item");

    // Simulate swipe
    fireEvent.touchStart(brewItem, { touches: [{ clientX: 200 }] });
    fireEvent.touchMove(brewItem, { touches: [{ clientX: 100 }] }); // 100px swipe
    fireEvent.touchEnd(brewItem);

    expect(screen.getByText("Delete Brew")).toBeInTheDocument();
  });

  it("does not show delete confirmation on insufficient swipe", () => {
    render(<BrewItem {...defaultProps} />);

    const brewItem = screen.getByTestId("brew-item");

    // Simulate small swipe
    fireEvent.touchStart(brewItem, { touches: [{ clientX: 200 }] });
    fireEvent.touchMove(brewItem, { touches: [{ clientX: 180 }] }); // 20px swipe
    fireEvent.touchEnd(brewItem);

    expect(screen.queryByText("Delete Brew")).not.toBeInTheDocument();
  });
});
