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

// العنوان الجديد للـ Endpoint
const API_URL = "http://10.2.15.9:8000/chatbot";

const DEFAULT_AGENT = {
  name: "Local AI Assistant",
  description: "AI Text Assistant",
};

const ChatActions = ({ className, children, ...props }) => (
  <div className={cn("flex items-center gap-1 mt-1", className)} {...props}>
    {children}
  </div>
);

const ChatAction = ({ tooltip, children, label, className, ...props }) => {
  const btnClass = cn(
    "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 relative size-8 p-1.5 border border-blue-600/30 bg-[#070b14] rounded-md inline-flex items-center justify-center transition-colors",
    className,
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild={false}>
            <button className={btnClass} type="button" {...props}>
              {children}
              <span className="sr-only">{label || tooltip}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#070b14] border border-blue-600/40 text-slate-200 font-mono text-[11px]">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <button className={btnClass} type="button" {...props}>
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </button>
  );
};

export default function Chat() {
  return <ChatComp />;
}

export function ChatComp() {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // نقوم بإرسال الرسالة في الـ Body
        body: JSON.stringify({ message: text }), 
      });

      const data = await res.json();

      if (!res.ok) {
        setError(`API error: ${res.statusText}`);
        return;
      }

      // عدل المسار هنا (data.reply) حسب ما يرجعه الـ Backend الخاص بك
      const reply = data?.reply || data?.response || "(no response)";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

    } catch (e) {
      setError(`Network error: ${e.message}`);
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
    <Card className="mx-auto flex h-full w-full flex-col gap-0 overflow-hidden rounded-none bg-[#070b14] border border-blue-600/30 shadow-[0_0_15px_rgba(37,99,235,0.03)] text-slate-200">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between pb-4 rounded-none border-b border-blue-600/20 bg-[#070b14]">
        <div className="flex items-center gap-4 rounded-none">
          <div className="ring-blue-600/20 relative flex size-10 items-center justify-center overflow-hidden rounded-full ring-1 bg-blue-950/10 shadow-[0_0_10px_rgba(37,99,235,0.05)] border border-blue-600/30">
            <SparklesIcon className="size-5 text-blue-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm leading-none font-medium font-mono uppercase tracking-wider text-slate-200">
              {DEFAULT_AGENT.name}
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
              {error ? (
                <p className="text-red-500 animate-pulse font-bold">{error}</p>
              ) : isLoading ? (
                <p className="text-blue-600 animate-pulse font-bold">
                  Analyzing Prompt…
                </p>
              ) : (
                <p className="font-bold text-blue-600">System Ready</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 bg-[#070b14]">
        <Conversation className="h-full">
          <ConversationContent className="flex min-w-0 flex-col gap-4 p-6 pb-2">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<SparklesIcon className="size-8 text-slate-600" />}
                title={
                  <span className="font-mono text-slate-400 uppercase tracking-widest text-sm">
                    Start System Log
                  </span>
                }
                description={
                  <span className="font-mono text-slate-500 text-xs">
                    Enter commands to trigger AI execution threads.
                  </span>
                }
              />
            ) : (
              messages.map((message, index) => (
                <div key={index} className="flex w-full flex-col gap-1">
                  <Message
                    from={message.role}
                    className="gap-3 [&_[class*='bg-']]:bg-transparent [&_[class*='bg-']]:shadow-none"
                  >
                    <MessageContent className="max-w-full min-w-0 !bg-transparent shadow-none">
                      <Response className="w-auto [overflow-wrap:anywhere] whitespace-pre-wrap rounded-lg p-3 font-mono text-sm leading-relaxed !bg-transparent border-none !text-slate-200 shadow-none">
                        {message.content}
                      </Response>
                    </MessageContent>
                    {message.role === "assistant" && (
                      <div className="flex size-6 flex-shrink-0 items-center justify-center self-end overflow-hidden rounded-full">
                        <SparklesIcon className="size-3 text-blue-600" />
                      </div>
                    )}
                  </Message>
                  {message.role === "assistant" && (
                    <ChatActions className="justify-start pl-0">
                      <ChatAction
                        tooltip={
                          copiedIndex === index ? "Copied!" : "Copy Payload"
                        }
                        onClick={() => {
                          navigator.clipboard.writeText(message.content);
                          setCopiedIndex(index);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                      >
                        {copiedIndex === index ? (
                          <CheckIcon className="size-3.5 text-blue-600" />
                        ) : (
                          <CopyIcon className="size-3.5 text-slate-400" />
                        )}
                      </ChatAction>
                    </ChatActions>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex w-full flex-col gap-1">
                <Message from="assistant" className="gap-3">
                  <MessageContent className="max-w-full min-w-0 !bg-transparent shadow-none">
                    <Response className="font-mono text-xs italic animate-pulse rounded-lg p-3 !bg-transparent border-none !text-slate-400 shadow-none">
                      Fetching stream from execution core...
                    </Response>
                  </MessageContent>
                </Message>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton className="bg-[#070b14] text-slate-400 hover:text-slate-200" />
        </Conversation>
      </CardContent>

      <CardFooter className="shrink-0 border-t border-blue-600/20 bg-[#070b14] pt-3 pb-4">
        <div className="flex w-full items-center gap-2 max-w-4xl mx-auto">
          <Input
            value={textInput}
            onChange={handleTextInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your system query..."
            className="h-11 bg-[#070b14] border border-blue-600/40 text-blue-600 focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/30 placeholder-slate-600 font-mono text-sm focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            size="icon"
            disabled={!canSend}
            className="border border-blue-600/40 bg-blue-950/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg size-11 flex-shrink-0 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.08)] uppercase tracking-widest text-sm"
          >
            {isLoading ? (
              <span className="text-xs animate-pulse font-mono">...</span>
            ) : (
              <SendIcon className="size-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}