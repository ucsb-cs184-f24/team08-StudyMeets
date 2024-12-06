import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import SettingsTab from "./SettingsTab"; // Adjust the path as necessary

// Mock useNavigation from react-navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("SettingsTab Component", () => {
  let navigateMock;

  beforeEach(() => {
    // Mock the navigate function
    navigateMock = jest.fn();
    useNavigation.mockReturnValue({ navigate: navigateMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the SettingsTab component correctly", () => {
    const { getByText, getByTestId } = render(<SettingsTab />);

    // Check for the title
    expect(getByText("Settings")).toBeTruthy();

    // Check for the setting options
    expect(getByText("Notification Settings")).toBeTruthy();
    expect(getByText("Profile Privacy Settings")).toBeTruthy();
    expect(getByText("General Settings")).toBeTruthy();

    // Check for the mail icon
    const mailIcon = getByTestId("mail-icon");
    expect(mailIcon).toBeTruthy();
  });

  test("navigates to Notifications when the mail icon is pressed", () => {
    const { getByTestId } = render(<SettingsTab />);
    const mailIcon = getByTestId("mail-icon");

    fireEvent.press(mailIcon);
    expect(navigateMock).toHaveBeenCalledWith("Notifications");
  });

  test("navigates to Notification Settings when the option is pressed", () => {
    const { getByText } = render(<SettingsTab />);
    const notificationSettingsOption = getByText("Notification Settings");

    fireEvent.press(notificationSettingsOption);
    expect(navigateMock).toHaveBeenCalledWith("Notification Settings");
  });

  test("navigates to Profile Privacy Settings when the option is pressed", () => {
    const { getByText } = render(<SettingsTab />);
    const profilePrivacyOption = getByText("Profile Privacy Settings");

    fireEvent.press(profilePrivacyOption);
    expect(navigateMock).toHaveBeenCalledWith("Profile Privacy Settings");
  });

  test("navigates to General Settings when the option is pressed", () => {
    const { getByText } = render(<SettingsTab />);
    const generalSettingsOption = getByText("General Settings");

    fireEvent.press(generalSettingsOption);
    expect(navigateMock).toHaveBeenCalledWith("General Settings");
  });
});
