import { Metadata } from "next";
import WidgetClient from "./WidgetClient";

export const metadata: Metadata = {
  title: "Days Until Widget",
};

export default function WidgetPage() {
  return <WidgetClient />;
}
