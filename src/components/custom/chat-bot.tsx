import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "../ui/button";
import { Send } from "react-bootstrap-icons";
import {
  ChangeEvent,
  ChangeEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Robot } from "react-bootstrap-icons";
import {
  useLazyAiNavigationQuery,
  useLazyRetrieveQuery,
} from "@/app/api/ai/ai-api-slice";
import { AiOption, NavigationRoute } from "@/app/api/types/ai-response.type";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import MovieLink from "./movie-link";

export type Message = {
  role: string;
  content: ReactNode;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedValue, setSelectedValue] = useState(AiOption.LIST);
  const [
    getAiNavigation,
    {
      isFetching: isGenerating,
      data: navigationData,
      isSuccess: isNavigated,
      isError: isNavigatedError,
    },
  ] = useLazyAiNavigationQuery();
  const [
    getMoviesFromAIRetriever,
    {
      isFetching: isRetrieving,
      data: movieData,
      isSuccess: isRetrieved,
      isError: isRetrievedError,
    },
  ] = useLazyRetrieveQuery();

  const aiRequestDispatch = (query: string) => {
    if (selectedValue === AiOption.NAVIGATE) {
      getAiNavigation({ query });
    } else if (selectedValue === AiOption.LIST) {
      getMoviesFromAIRetriever({
        collection_name: "movies",
        query,
        amount: 10,
        threshold: 0.5,
      });
    } else if (selectedValue === AiOption.NATURAL_TEXT) {
    }
  };

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isNavigated) {
      return;
    }
    console.log("navigationData", navigationData);

    if (navigationData?.data?.route == NavigationRoute.NONE) {
      setMessages((prev) => {
        return [
          ...prev,
          {
            content: "Sorry, I can't find any information with your query 😔",
            role: "ai",
          },
        ];
      });
    } else if (navigationData.data?.route == NavigationRoute.SEARCH_PAGE) {
      const displayParams = navigationData?.data?.params.keyword
        ? " with keyword " + navigationData?.data?.params.keyword
        : "";
      setMessages((prev) => {
        return [
          ...prev,
          {
            content: `I redirected you site to find related movies${displayParams}' 🚀`,
            role: "ai",
          },
        ];
      });
      navigate(`/movie/search?query=${navigationData?.data?.params.keyword}`);
    } else if (navigationData.data?.route == NavigationRoute.MOVIE_PAGE) {
      const displayParams = navigationData?.data?.params[0].name
        ? " " + navigationData?.data?.params[0].name
        : "";
      setMessages((prev) => {
        return [
          ...prev,
          {
            content: `😆, I found the movie${displayParams}, redirected the detailed site for you 🚀`,
            role: "ai",
          },
        ];
      });
      navigate(`/movie/${navigationData?.data?.params[0].id}`);
    } else if (navigationData.data?.route == NavigationRoute.GENRE_PAGE) {
      let displayParams = navigationData?.data?.params
        .map((item: { name: string; id: number }) => item.name)
        .join(", ");
      displayParams = displayParams ? " with genres " + displayParams : "";
      setMessages((prev) => {
        return [
          ...prev,
          {
            content: `😆, I found some movies matching your requirement${displayParams}, redirected to the site for you 🚀`,
            role: "ai",
          },
        ];
      });
      navigate(
        `/movie?genres=${navigationData?.data?.params
          .map((item: { name: string; id: number }) => item.id)
          .join(",")}`
      );
    } else if (navigationData.data?.route == NavigationRoute.CAST_PAGE) {
      setMessages((prev) => {
        const displayParams = navigationData?.data?.params[0].name
          ? " " + navigationData?.data?.params[0].name
          : "";
        return [
          ...prev,
          {
            content: `😆, I found some actors for the film${displayParams}, redirected the site for you`,
            role: "ai",
          },
        ];
      });
      navigate(`/movie/${navigationData?.data?.params[0].id}#cast`);
    }
  }, [isNavigated, navigationData]);

  useEffect(() => {
    if (!isRetrieved) {
      return;
    }
    console.log("movieData", movieData);

    if (movieData?.data?.result.length === 0) {
      setMessages((prev) => {
        return [
          ...prev,
          {
            content: "Sorry, I can't find any information with your query 😔",
            role: "ai",
          },
        ];
      });
    } else {
      setMessages((prev) => {
        return [
          ...prev,
          {
            content: (
              <div>
                <span>I found some movies related to your query 🚀</span>
                <ul className="list-disc pl-4 space-y-2">
                  {movieData?.data?.result.map((movie: any) => (
                    <li key={movie.tmdb_id}>
                      <MovieLink movieId={movie.id} movieName={movie.title} />
                    </li>
                  ))}
                </ul>
              </div>
            ),
            role: "ai",
          },
        ];
      });
    }
  }, [isRetrieved, movieData]);

  useEffect(() => {
    if (!isNavigatedError && !isRetrievedError) {
      return;
    }
    setMessages((prev) => {
      return [
        ...prev,
        {
          content: "🥲, something went wrong. Please try again later.",
          role: "ai",
        },
      ];
    });
  }, [isNavigatedError, isRetrievedError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) {
      return;
    }
    setMessages((prev) => {
      return [
        ...prev,
        {
          content: input,
          role: "user",
        },
      ];
    });
    setInput("");
    aiRequestDispatch(input);
  };

  const onInputChange: ChangeEventHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInput(event.target.value);
  };

  return (
    <ExpandableChat size="md" position="bottom-right" icon={<Robot />}>
      <ExpandableChatHeader className="bg-muted/60 text-center flex justify-between">
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-lg font-semibold">TMDB2 AI</h1>
          <Select defaultValue={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger className="text-xs w-28">
              {selectedValue}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AiOption.LIST}>{AiOption.LIST}</SelectItem>
              <SelectItem value={AiOption.NAVIGATE}>
                {AiOption.NAVIGATE}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="default" onClick={() => setMessages([])}>
          New Chat
        </Button>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList className="bg-muted/25" ref={messagesRef}>
          {/* Initial message */}
          <ChatBubble variant="received">
            <ChatBubbleAvatar src="" fallback="🤖" />
            <ChatBubbleMessage>
              Hello! What do you want to search on TMDB2?
            </ChatBubbleMessage>
          </ChatBubble>

          {/* Messages */}
          {messages &&
            messages.map((message, index) => (
              <ChatBubble
                key={index}
                variant={message.role == "user" ? "sent" : "received"}
              >
                {message.role !== "user" && (
                  <ChatBubbleAvatar src="" fallback={"🤖"} />
                )}
                <ChatBubbleMessage
                  variant={message.role == "user" ? "sent" : "received"}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

          {/* Loading */}
          {(isGenerating || isRetrieving) && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter className="bg-muted/25">
        <form ref={formRef} className="flex relative gap-2" onSubmit={onSubmit}>
          <ChatInput
            value={input}
            onChange={onInputChange}
            // onKeyDown={onKeyDown}
            className="min-h-12 bg-background shadow-none "
          />
          <Button
            className="absolute top-1/2 right-2 transform  -translate-y-1/2"
            type="submit"
            size="icon"
            // disabled={isLoading || isGenerating || !input}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
