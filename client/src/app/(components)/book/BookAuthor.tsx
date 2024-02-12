import Book from "@/types/book";
import { Button } from "@material-tailwind/react";
export default ({ book }: { book: Book }) => {
	return (
		<div className="py-3">
			<div>Tác Giả: {
				<Button children={book.author.name} placeholder={null} className="bg-none" />
			}</div>
		</div>
	) 
}