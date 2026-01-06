"use client";

import { useState } from "react";
import { LightbulbIcon, SparkleIcon, Button, Input } from "@/app/components";
import { Idea } from "../types";
import { MAX_DESCRIPTION_LENGTH } from "../constants";

function CreateIdeaBox({
  onCreateIdea,
  userName,
}: {
  onCreateIdea: (idea: Idea) => void;
  userName: string;
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showExtras = titulo.trim() || tags.length > 0;

  const validateForm = (): string | null => {
    if (!titulo.trim()) {
      return "Title is required";
    }
    if (!descricao.trim()) {
      return "Description with content is required";
    }
    if (tags.length < 3) {
      return `You need at least 3 tags (${tags.length}/3)`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage("");

    setIsLoading(true);
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          tags: tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create idea");
      }

      const data = await response.json();

      onCreateIdea({
        id: data.id,
        titulo: data.titulo,
        descricao: data.descricao,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        autorId: data.autorId,
        autorName: userName,
        tags: data.tags,
        commentCount: 0,
        createdAt: data.createdAt,
      });

      setTitulo("");
      setDescricao("");
      setTags([]);
      setTagInput("");
    } catch (error) {
      console.error("Error creating idea:", error);
      setErrorMessage("Error creating idea. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="neo-border neo-shadow-lg bg-white p-6 mb-6 animate-fade-in-up stagger-1">
      {errorMessage && (
        <div className="neo-border bg-[var(--hot-pink)] text-white p-4 mb-4 font-body text-sm flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1">
            <p className="font-medium">Oops!</p>
            <p>{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="flex-shrink-0 hover:opacity-80"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="neo-border bg-[var(--lime)] p-3 hidden sm:block">
          <LightbulbIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: App that turns memes into NFTs..."
            variant="accent"
            size="lg"
            className="w-full mb-4"
          />

          {showExtras && (
            <>
              <div className="flex justify-end mb-2">
                <span className="text-sm font-body text-[var(--deep-black)]/50">
                  {descricao.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
              <textarea
                value={descricao}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescricao(e.target.value);
                  }
                }}
                placeholder="Descreva sua ideia em detalhes..."
                className="neo-border bg-[var(--cream)] p-4 w-full min-h-[120px] mb-4 font-body text-sm resize-none focus:outline-none focus:bg-white"
              />
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap items-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="neo-border bg-[var(--lime)] px-3 py-1 text-sm font-body flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-[var(--hot-pink)]"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  placeholder="+ tag"
                  size="sm"
                  className="w-24"
                />
                <button
                  onClick={addTag}
                  className="neo-border bg-[var(--cream)] px-2 py-1 text-sm font-body hover:bg-[var(--lime)]"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={isLoading}
                className="neo-border-thick whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <SparkleIcon className="w-5 h-5" />
                  {isLoading ? "CREATING..." : "CREATE IDEA"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateIdeaBox;
