import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MessageSquarePlus } from 'lucide-react';
import { StarRating } from '../common/StarRating';
import { VerifiedBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';
import { useSelector } from 'react-redux';
import { useToast } from '../common/Toast';

export const ReviewList = ({ productId, averageRating = 0, numReviews = 0 }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { addToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState({ eligible: false, reason: '' });
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  // New review state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/reviews/product/${productId}`);
      setReviews(res.data.reviews || []);
      setDistribution(res.data.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axiosClient.get(`/reviews/eligibility/${productId}`);
      setEligibility(res.data);
    } catch (err) {
      setEligibility({ eligible: false, reason: 'Not eligible' });
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
      checkEligibility();
    }
  }, [productId, isAuthenticated]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim() || userComment.length < 5) {
      addToast('Please provide a thoughtful review (at least 5 characters).', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await axiosClient.post('/reviews', {
        productId,
        orderId: eligibility.orderId,
        rating: userRating,
        comment: userComment
      });

      addToast('Thank you! Your verified artisan review has been published.', 'success');
      setUserComment('');
      setIsReviewFormOpen(false);
      fetchReviews();
      checkEligibility();
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Overview Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Average Score */}
          <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-stone-100">
            <span className="font-serif text-5xl font-bold text-stone-900 leading-none mb-2">
              {Number(averageRating).toFixed(1)}
            </span>
            <StarRating rating={averageRating} size="md" />
            <span className="text-xs text-stone-500 mt-2 font-medium">
              Based on {numReviews} verified customer {numReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars] || 0;
              const percent = numReviews > 0 ? Math.round((count / numReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-stone-600 font-medium flex items-center gap-1">
                    {stars} <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amberGold-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right text-stone-400 font-mono text-[11px]">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Review Action */}
          <div className="flex flex-col items-center justify-center text-center p-4 border-t md:border-t-0 md:border-l border-stone-100">
            {eligibility.eligible ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Buyer
                </div>
                <p className="text-xs text-stone-500">
                  You purchased this item in order #{eligibility.orderNumber}. Share your feedback with the community!
                </p>
                <button
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-bold transition-all shadow"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  {isReviewFormOpen ? 'Close Review Form' : 'Write Verified Review'}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-stone-700">Verified Purchase Reviews</span>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Only buyers who have purchased and received this handcrafted item can submit reviews to maintain genuine quality ratings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      {isReviewFormOpen && eligibility.eligible && (
        <form
          onSubmit={handleReviewSubmit}
          className="bg-artisan-100/60 rounded-3xl border border-terracotta-200 p-6 sm:p-8 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg font-bold text-stone-900">Your Craft Feedback</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-600">Select Rating:</span>
              <StarRating
                rating={userRating}
                interactive={true}
                onRatingChange={setUserRating}
                size="md"
              />
            </div>
          </div>

          <div>
            <textarea
              rows={4}
              required
              placeholder="What did you love about this item? Detail the texture, materials, packaging, and artisanal quality..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              className="w-full p-4 bg-white border border-stone-300 rounded-2xl text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsReviewFormOpen(false)}
              className="px-5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Submit Verified Review'}
            </button>
          </div>
        </form>
      )}

      {/* List of Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-stone-200 p-6">
            <p className="text-sm text-stone-500">No reviews yet. Be the first verified buyer to review this craft!</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={rev.user?.name || 'Reviewer'}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-stone-900">{rev.user?.name || 'Artisan Collector'}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={rev.rating} size="xs" />
                      <span className="text-[11px] text-stone-400">• {formatDate(rev.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {rev.isVerifiedPurchase && <VerifiedBadge />}
              </div>

              <p className="text-sm text-stone-700 leading-relaxed pl-13 font-normal">
                "{rev.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;
