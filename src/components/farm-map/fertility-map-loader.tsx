"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import { FertilityMap } from "./fertility-map";

export function FertilityMapLoader() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <FertilityMap />
      </APIProvider>
    </div>
  );
}
