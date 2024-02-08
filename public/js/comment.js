const handleNewComment = async (event) => {
	event.preventDefault();

	const text = document.querySelector('#text').value.trim();
	const post_id = document.querySelector('#post_id').value.trim();

	if (text) {
		const response = await fetch(`/api/comments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
      body: JSON.stringify({ text, post_id }),
		});

		if (response.ok) {
			document.location.replace(`/post/${post_id}`);
		} else {
			alert('Something went wrong, failed to create new comment.');
		}
	}
};

const handleChangeToEdit = async (event) => {
	if (event.target.hasAttribute('data-id')) {
		// toggle button
		document.getElementById('updateBtn').className = 'btn btn-primary visible';

		document.getElementById('title').className = 'form-control';
		document.getElementById('description').className = 'form-control';
	}
};

const handleUpdatePost = async (event) => {
	event.preventDefault();

	const title = document.querySelector('#title').value.trim();
	const description = document.querySelector('#description').value.trim();
	const post_id = document.querySelector('#post_id').value.trim();

	if (title && description) {
		const response = await fetch(`/api/posts/${post_id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
      body: JSON.stringify({ title, description }),
		});

		if (response.ok) {
			document.location.replace(`/post/${post_id}`);
		} else {
			alert('Something went wrong, failed to update post.');
		}
	}
};

document.querySelector('.new-comment').addEventListener('submit', handleNewComment);
document.querySelector('.post').addEventListener('click', handleChangeToEdit)
document.querySelector('.new-post').addEventListener('submit', handleUpdatePost);