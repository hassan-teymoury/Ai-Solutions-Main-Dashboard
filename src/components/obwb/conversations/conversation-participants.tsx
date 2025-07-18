import { ConversationDetailResponse } from "@/types/emails";

interface ParticipantInfo {
  name: string;
  email: string;
}

interface ConversationParticipantsProps {
  participants: ConversationDetailResponse["participants"];
}

export function ConversationParticipants({
  participants,
}: ConversationParticipantsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Participants</h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(participants).map(([key, value]) => {
          // Handle different participant value types
          let displayValue = "";
          if (typeof value === "string") {
            displayValue = value;
          } else if (typeof value === "object" && value !== null) {
            // If value is an object with email and name properties
            if ("email" in value && "name" in value) {
              const participant = value as ParticipantInfo;
              displayValue = `${participant.name} (${participant.email})`;
            } else {
              // Fallback: stringify the object
              displayValue = JSON.stringify(value);
            }
          } else {
            displayValue = String(value);
          }

          return (
            <span
              key={key}
              className="px-2 py-1 bg-primary/10 rounded-md text-xs"
            >
              {displayValue}
            </span>
          );
        })}
      </div>
    </div>
  );
} 