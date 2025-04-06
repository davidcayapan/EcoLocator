import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { MessageSquare, Send, User, Building2, Trash2 } from 'lucide-react';

interface Comment {
  _id: string;
  content: string;
  userEmail: string;
  userName: string;
  userRole: string;
  createdAt: string;
}

interface CommentsProps {
  articleId: string;
}

export default function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const { email, userRole } = useUser();

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          content: newComment,
          userEmail: email,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!email) return;

    try {
      setDeletingCommentId(commentId);
      const response = await fetch(`/api/comments/${commentId}?userEmail=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      } else {
        const error = await response.json();
        console.error('Error deleting comment:', error);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-green-600" />
        Discussion
      </h3>

      {email ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isLoading}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className={`inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ${
                (isLoading || !newComment.trim()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
          <p className="text-gray-600">Please sign in to join the discussion.</p>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 rounded-full p-2">
                {comment.userRole === 'provider' ? (
                  <Building2 className="h-5 w-5 text-gray-600" />
                ) : (
                  <User className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{comment.userName}</span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                      {comment.userRole === 'provider' ? 'Service Provider' : 'Community Member'}
                    </span>
                  </div>
                  {email === comment.userEmail && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      disabled={deletingCommentId === comment._id}
                      className={`text-red-500 hover:text-red-600 p-1 rounded transition-colors ${
                        deletingCommentId === comment._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{comment.content}</p>
                <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}