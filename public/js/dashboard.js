const handleNewPost = async (event) => {
	event.preventDefault();

	const title = document.querySelector('#title').value.trim();
	const description = document.querySelector('#description').value.trim();

	if (title && description) {
		const response = await fetch(`/api/posts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
      body: JSON.stringify({ title, description }),
		});

		if (response.ok) {
			document.location.replace('/dashboard');
		} else {
			alert('Something went wrong, failed to create new post.');
		}
	}
};

const handleDeletePost = async (event) => {
	if (event.target.hasAttribute('data-id')) {
		const post_id = event.target.getAttribute('data-id');

		const response = await fetch(`/api/posts/${post_id}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			document.location.reload();
		} else {
			alert('Something went wrong, failed to delete post.');
		}
	}
};

document.querySelector('.new-post').addEventListener('submit', handleNewPost);

document.querySelector('.posts').addEventListener('click', handleDeletePost);