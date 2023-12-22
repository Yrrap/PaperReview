function CommentsSection() {
    const comments = [{ text: "Comment 1" }]; // Mock data
    return (
      <div>
        {comments.map(comment => <Comment key={comment.text} text={comment.text} />)}
      </div>
    );
  }
  