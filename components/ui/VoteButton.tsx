"use client";

import { useOptimistic, useTransition } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { voteProduct, type VoteType } from "@/lib/products/product-actions";

interface VoteButtonProps {
    productId: number;
    initialVotes: number;
}

type VoteState = {
    count: number;
    userVote: VoteType | null;
};

export function VoteButton({ productId, initialVotes }: VoteButtonProps) {
    const [isPending, startTransition] = useTransition();

    const [optimistic, setOptimistic] = useOptimistic<VoteState, VoteType | null>(
        { count: initialVotes, userVote: null },
        (state, newVote) => {
            if (newVote === null) return { count: initialVotes, userVote: null };
            if (state.userVote === newVote) {
                // toggling off
                return { count: initialVotes, userVote: null };
            }
            // switching or fresh vote: remove old delta, add new
            const oldDelta = state.userVote === "up" ? 1 : state.userVote === "down" ? -1 : 0;
            const newDelta = newVote === "up" ? 1 : -1;
            return { count: initialVotes - oldDelta + newDelta, userVote: newVote };
        }
    );

    function handleVote(type: VoteType) {
        startTransition(async () => {
            const isToggleOff = optimistic.userVote === type;
            setOptimistic(isToggleOff ? null : type);
            // Toggle off reverses the previously applied vote; otherwise apply the new direction
            await voteProduct(productId, isToggleOff ? (type === "up" ? "down" : "up") : type);
        });
    }

    return (
        <div className="flex flex-col items-center gap-0.5 px-1.5 py-1">
            <button
                onClick={(e) => { e.preventDefault(); handleVote("up"); }}
                aria-label="Upvote"
                disabled={isPending}
                className={`rounded p-1 transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50 ${
                    optimistic.userVote === "up" ? "text-primary" : "text-muted-foreground"
                }`}
            >
                <ChevronUp className="size-4" />
            </button>
            <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-foreground">
                {optimistic.count}
            </span>
            <button
                onClick={(e) => { e.preventDefault(); handleVote("down"); }}
                aria-label="Downvote"
                disabled={isPending}
                className={`rounded p-1 transition-colors hover:bg-transparent hover:text-destructive disabled:opacity-50 ${
                    optimistic.userVote === "down" ? "text-destructive" : "text-muted-foreground"
                }`}
            >
                <ChevronDown className="size-4" />
            </button>
        </div>
    );
}
