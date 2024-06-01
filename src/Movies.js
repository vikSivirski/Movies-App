import React, {useEffect} from "react";

function Movies() {
    const getMovies = () => {
        fetch('https://api.themoviedb.org/3/discover/movie?api_key=8490441a780d696323472e0a8e97e0ca')
        .then((res) => res.json())
        .then(json => console.log(json))
    }
    
    useEffect(() => {
        getMovies()
    }, []) 

    return(
        <div>
            movie
        </div>
    )
}

export default Movies

