import React, { useEffect, useState } from 'react';
import './book.scss';
import { useParams } from 'react-router-dom';

import { bookURL } from '../SERVER';

export default function Book() {
	const { id } = useParams();
	const [book, setBook] = useState({});

	useEffect(() => {
		fetch(`${bookURL}${id}`)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					return Promise.reject();
				}
			})
			.then((data) => setBook(data))
			.catch((err) => console.error(err));
	}, []);

	return (
		<> 
			<div class="container">
				<div class="row">
					<div class="col-6">
					<img src={`https://picsum.photos/500/500`} alt="book cover" width={500} height={500} />
					</div>
					<div class="col-6"> 
						<dl>
							<dt>title</dt>
							<dd>{book.title}</dd>
							<dt>author</dt>
							<dd>{book.author}</dd>
							<dt>genre</dt>
							<dd>{book.genre}</dd>
							<dt>year</dt>
							<dd>{book.yearPublished}</dd>
						</dl> 
						<div class="col-4">
							<button class="backBtn">go back</button>
						</div>
						<div class="col-6">
							<button class="addBtn">add to list</button>
						</div>
					</div>
				</div>	
			</div>
		</>
	);
}
