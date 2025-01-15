import { render, screen } from "@testing-library/react";
import { act } from "react";
import BrewList from "../components/BrewList";

// Mock BrewItem component
jest.mock("../components/BrewItem", () => {
  return function MockBrewItem({
    id,
    beanType,
    brewType,
    waterTemp,
    weightIn,
    weightOut,
    brewTime,
    bloomTime,
    details,
  }: any) {
    return (
      <div data-testid="brew-item">
        {beanType}
        {brewType}
        {waterTemp}°C
        {weightIn}g{weightOut}g{brewTime}
        {bloomTime > 0 && `${bloomTime}s`}
        {details}
      </div>
    );
  };
});

describe("BrewList", () => {
  const mockBrews = [
    {
      id: 1,
      beanType: "Ethiopian Yirgacheffe",
      imageUrl: "http://example.com/coffee1.jpg",
      brewType: "Pour Over",
      waterTemp: 93,
      weightIn: 18,
      weightOut: 36,
      brewTime: "02:30",
      bloomTime: 30,
      details: "Light and floral",
    },
    {
      id: 2,
      beanType: "Colombian Supremo",
      imageUrl: "http://example.com/coffee2.jpg",
      brewType: "Espresso",
      waterTemp: 94,
      weightIn: 18,
      weightOut: 36,
      brewTime: "00:25",
      bloomTime: 0,
      details: "Rich and bold",
    },
  ];

  it("renders list of brews with all details", () => {
    act(() => {
      render(<BrewList brews={mockBrews} onDeleteBrew={() => {}} />);
    });

    const brewItems = screen.getAllByTestId("brew-item");
    expect(brewItems).toHaveLength(2);

    // Check first brew
    expect(brewItems[0]).toHaveTextContent("Ethiopian Yirgacheffe");
    expect(brewItems[0]).toHaveTextContent("Pour Over");
    expect(brewItems[0]).toHaveTextContent("93°C");
    expect(brewItems[0]).toHaveTextContent("18g");
    expect(brewItems[0]).toHaveTextContent("36g");
    expect(brewItems[0]).toHaveTextContent("02:30");
    expect(brewItems[0]).toHaveTextContent("30s");
    expect(brewItems[0]).toHaveTextContent("Light and floral");

    // Check second brew
    expect(brewItems[1]).toHaveTextContent("Colombian Supremo");
    expect(brewItems[1]).toHaveTextContent("Espresso");
    expect(brewItems[1]).toHaveTextContent("94°C");
    expect(brewItems[1]).toHaveTextContent("18g");
    expect(brewItems[1]).toHaveTextContent("36g");
    expect(brewItems[1]).toHaveTextContent("00:25");
    expect(brewItems[1]).not.toHaveTextContent("Bloom Time");
    expect(brewItems[1]).toHaveTextContent("Rich and bold");
  });

  it("renders empty state when no brews are provided", () => {
    act(() => {
      render(<BrewList brews={[]} onDeleteBrew={() => {}} />);
    });
    expect(screen.getByText(/no brews yet/i)).toBeInTheDocument();
    expect(screen.getByText("☕")).toBeInTheDocument();
  });
});
