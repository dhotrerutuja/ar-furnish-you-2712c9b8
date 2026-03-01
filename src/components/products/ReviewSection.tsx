import React, { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { useReviews } from "@/contexts/ReviewContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { getProductReviews, addReview, getAverageRating } = useReviews();
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  const reviews = getProductReviews(productId);
  const avgRating = getAverageRating(productId);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    if (!comment.trim()) {
      toast({ title: "Please write a review", variant: "destructive" });
      return;
    }
    addReview(productId, user?.name || "Anonymous", rating, comment.trim());
    toast({ title: "Review submitted!", description: "Thank you for your feedback." });
    setRating(0);
    setComment("");
    setShowForm(false);
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground mb-6">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Rating summary */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-black text-foreground">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</div>
          <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-secondary text-secondary" : "text-border"}`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Distribution bars */}
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-muted-foreground">{star}★</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <span className="w-6 text-muted-foreground text-right">{count}</span>
            </div>
          ))}
        </div>

        {/* Write review button */}
        <div className="flex flex-col items-center md:items-end justify-center">
          {isLoggedIn ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-full hover:brightness-110 transition-all text-sm"
            >
              Write a Review
            </button>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              <a href="/login" className="text-primary hover:underline font-medium">Login</a> to write a review
            </p>
          )}
        </div>
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted/50 rounded-lg p-6 mb-8 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Your Review</h3>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                >
                  <Star className={`h-7 w-7 cursor-pointer transition-colors ${s <= (hoverRating || rating) ? "fill-secondary text-secondary" : "text-border"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">{comment.length}/500</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary text-primary-foreground font-bold py-2 px-6 rounded-full hover:brightness-110 transition-all text-sm">
              Submit Review
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">{review.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-secondary text-secondary" : "text-border"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
