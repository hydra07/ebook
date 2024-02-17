'use client';
import Book from "@/types/book";
import axios from "../../../lib/axios";
import {useEffect, useState} from 'react';
import ListBook from "@/app/(components)/listbook/ListBook";
import getVieString from "@/server/utils/standardizeVie";

type Type = {
    id: number; name: string; license: boolean; description: string; books: Book[];
}

async function getAllType() {
    const res = await axios.get(`/test/token/getType`)
    return res.data;
}

export default ({params}: { params: { name: string } }) => {
    const [types, setTypes] = useState<Type[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    useEffect(() => {
        const getTypes = async () => {
            setTypes(await getAllType());
        }
        const getType = (types: Type[], typeName: string): Type | null => {
            const result = types.find((type) => {
                if (getVieString(type.name) == getVieString(typeName)) {
                    return true;
                }
                return false;
            })
            return result || null;
        }

        getTypes();
        // setBooks(getType(types,params.name)?.books);
        console.log(types, params.name);
        // console.log(getType(types,params.name));
    }, [])
    return (<div>
            <ListBook books={books}/>
        </div>)
}