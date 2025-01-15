import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmation from "../components/DeleteConfirmation";

describe("DeleteConfirmation", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const beanType = "Ethiopian Yirgacheffe";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the confirmation dialog with correct content", () => {
    render(
      <DeleteConfirmation
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        beanType={beanType}
      />,
    );

    expect(screen.getByText("Delete Brew")).toBeInTheDocument();
    expect(
      screen.getByText(
        `Are you sure you want to delete your ${beanType} brew? This action cannot be undone.`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onConfirm when Delete button is clicked", () => {
    render(
      <DeleteConfirmation
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        beanType={beanType}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel when Cancel button is clicked", () => {
    render(
      <DeleteConfirmation
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        beanType={beanType}
      />,
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("calls onCancel when clicking outside the dialog", () => {
    render(
      <DeleteConfirmation
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        beanType={beanType}
      />,
    );

    fireEvent.click(screen.getByTestId("delete-overlay"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("does not call onCancel when clicking inside the dialog", () => {
    render(
      <DeleteConfirmation
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        beanType={beanType}
      />,
    );

    fireEvent.click(screen.getByTestId("delete-dialog"));
    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});
