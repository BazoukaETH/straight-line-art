import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/founder/clients")({
  beforeLoad: () => {
    throw redirect({ to: "/clients" });
  },
});
