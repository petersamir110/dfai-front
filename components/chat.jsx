"use client";

import { useCallback, useRef, useState } from "react";
import { CheckIcon, CopyIcon, SendIcon, SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation";
import { Input } from "@/components/ui/input";
import { Message, MessageContent } from "@/components/ui/message";
import { Response } from "@/components/ui/response";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_KEY = "YOUR_GEMINI_API_KEY";
const MODEL = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const DEFAULT_AGENT = {
  name: "Ai Assistant",
  description: "AI Text Assistant",
};

const ChatActions = ({ className, children, ...props }) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

const ChatAction = ({
  tooltip,
  children,
  label,
  className,
  variant = "ghost",
  size = "sm",
  ...props
}) => {
  const button = (
    <Button
      className={cn(
        "text-muted-foreground hover:text-foreground relative size-9 p-1.5",
        className,
      )}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default function Chat({ setChatBotIsOpen }) {
  return <ChatComp setChatBotIsOpen={setChatBotIsOpen} />;
}

export function ChatComp({ setChatBotIsOpen }) {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const historyRef = useRef([]);

  const handleTextInputChange = useCallback((e) => {
    setTextInput(e.target.value);
  }, []);

  const sendMessage = useCallback(async () => {
    const text = textInput.trim();
    if (!text || isLoading) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setTextInput("");
    setIsLoading(true);
    setError(null);

    const chatHistory = [
      ...historyRef.current,
      { role: "user", parts: [{ text }] },
    ];

    try {
      const res = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: chatHistory }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errDetail = data?.error?.message || "Unknown error";
        setError(`API error: ${errDetail}`);
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "(no response)";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      historyRef.current = [
        ...chatHistory,
        { role: "model", parts: [{ text: reply }] },
      ];
    } catch (e) {
      setError(`Network error: ${e.message}`);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [textInput, isLoading]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const canSend = textInput.trim() && !isLoading;

  return (
    <Card className="mx-auto flex h-full w-full flex-col gap-0 overflow-hidden">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-4">
          <div className="ring-border relative flex size-10 items-center justify-center overflow-hidden rounded-full ring-1 bg-indigo-50 dark:bg-indigo-950">
            <SparklesIcon className="size-5 text-indigo-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm leading-none font-medium">
              {DEFAULT_AGENT.name}
            </p>
            <div className="flex items-center gap-2">
              {error ? (
                <p className="text-destructive text-xs">{error}</p>
              ) : isLoading ? (
                <p className="text-muted-foreground text-xs animate-pulse">
                  Thinking…
                </p>
              ) : (
                <p className="text-xs text-green-600">Ready</p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setChatBotIsOpen(false);
          }}
        >
          <span>―</span>
        </button>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Conversation className="h-full">
          <ConversationContent className="flex min-w-0 flex-col gap-2 p-6 pb-2">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<SparklesIcon className="size-8 text-muted-foreground" />}
                title="Start a conversation"
                description="Type a message to chat with DFAI AI"
              />
            ) : (
              messages.map((message, index) => (
                <div key={index} className="flex w-full flex-col gap-1">
                  <Message from={message.role}>
                    <MessageContent className="max-w-full min-w-0">
                      <Response className="w-auto [overflow-wrap:anywhere] whitespace-pre-wrap">
                        {message.content}
                      </Response>
                    </MessageContent>
                    {message.role === "assistant" && (
                      <div className="flex size-6 flex-shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-indigo-50 dark:bg-indigo-950 ring-1 ring-border">
                        <SparklesIcon className="size-3.5 text-indigo-500" />
                      </div>
                    )}
                  </Message>
                  {message.role === "assistant" && (
                    <ChatActions>
                      <ChatAction
                        size="sm"
                        tooltip={copiedIndex === index ? "Copied!" : "Copy"}
                        onClick={() => {
                          navigator.clipboard.writeText(message.content);
                          setCopiedIndex(index);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                      >
                        {copiedIndex === index ? (
                          <CheckIcon className="size-4" />
                        ) : (
                          <CopyIcon className="size-4" />
                        )}
                      </ChatAction>
                    </ChatActions>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex w-full flex-col gap-1">
                <Message from="assistant">
                  <MessageContent className="max-w-full min-w-0">
                    <Response className="text-muted-foreground italic animate-pulse">
                      Thinking…
                    </Response>
                  </MessageContent>
                </Message>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </CardContent>

      <CardFooter className="shrink-0 border-t pt-3">
        <div className="flex w-full items-center gap-2">
          <Input
            value={textInput}
            onChange={handleTextInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            size="icon"
            variant="ghost"
            className="rounded-full"
            disabled={!canSend}
          >
            <SendIcon className="size-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
