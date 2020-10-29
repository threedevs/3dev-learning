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
			<section className="Section">
				<div className="Section__row">
					<h2 className="PageTitle">{book.title}</h2>	
					<div className="BookDetails">
					<img src={`https://picsum.photos/500/500`} alt="book cover" width={500} height={500} />
					</div>
					<div className="BookDetails"> 
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
					</div>
					<button className="Button Button__back">go back</button>
					<button className="Button Button__add">add to list</button>
				</div>	
			</section>
		</>
	);
}
