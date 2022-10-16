import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [comicEnded, setComicEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService()

    useEffect(() => {//запускается после рендера 
        onRequest(offset, true)
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicListLoaded)
    }

    const onComicListLoaded = (newComicList) => {//новый персонажи, которые будут добавляться 
        let ended = false
        if (newComicList.length < 8) {
            ended = true
        } 

        setComicsList(comicsList => [...comicsList, ...newComicList])
        setNewItemLoading(false)
        setOffset(offset => offset + 8)//добавляем к текущему offset 9 персонажей
        setComicEnded(ended)
    }

    function preRender(arr) {
        const items = arr.map((item,i) => {
            const imgNotAvailable = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' 
            let imgStyle = {'objectFit': 'cover'}

            if (item.thumbnail === imgNotAvailable) {
                imgStyle = {'objectFit': 'fill'}
            }

            return (
                <li key={i} className="comics__item">
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" style={imgStyle}/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return(
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }   

    const comics = preRender(comicsList)
    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !newItemLoading ? <Spinner/> : null

    return (
        <div className="comics__list">
            {comics}
            {errorMessage}
            {spinner}
            <button 
                className="button button__main button__long"
                style={{'display': comicEnded ? 'none' : 'block'}}
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;