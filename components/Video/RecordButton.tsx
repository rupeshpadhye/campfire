
import { setup, isSupported } from "@loomhq/loom-sdk";
import { oembed } from "@loomhq/loom-embed";
import { useEffect, useState } from "react";
import { Button } from "antd";

const API_KEY = process.env.NEXT_PUBLIC_LOOM_API_KEY; // "fd569f9e-7930-4f73-9a73-e96457045648";
//const BUTTON_ID = "loom-sdk-button";

export default function LoomRecordButton({ btnLabel, onInsertClicked, type, icon }) {
  const [buttonId, setButtonId] = useState(`loom-record-button-${Date.now()}`);
  useEffect(() => {
    async function setupLoom() {
      const { supported, error } = await isSupported();

      if (!supported) {
        console.warn(`Error setting up Loom: ${error}`);
        return;
      }

      const button = document.getElementById(buttonId);

      if (!button) {
        return;
      }

      const { configureButton } = await setup({
        apiKey: API_KEY,
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.on("insert-click", async video => {
        console.log("Insert clicked", video);
        onInsertClicked(video);
      });
    }

    setupLoom();
  }, []);

  return (
      <Button id={buttonId} type={type || 'default'} icon={icon}>{btnLabel}</Button>
  );
}