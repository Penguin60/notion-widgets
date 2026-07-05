import { Metadata } from "next";
import RepeatWidgetClient from "./RepeatWidgetClient";

export const metadata: Metadata = {
  title: "Repeating Task Widget",
};

export default function RepeatWidgetPage() {
  return <RepeatWidgetClient />;
}
