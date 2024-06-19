import "./Main.css";
import React, { useEffect, useState } from "react";

function Main() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [totalFavPopulation, setTotalFavPopulation] = useState(0);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectRegion, setSelectedRegion] = useState("");
  const [selectFavRegion, setSelectedFavRegion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("../../public/paises.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const savedFavorites = localStorage.getItem("favorites");
          let parsedFavorites = [];
          if (savedFavorites) {
            parsedFavorites = JSON.parse(savedFavorites);
            setFavorites(parsedFavorites);
            calcTotalFavPopulation(parsedFavorites);
          }
          const filteredData = data.filter(
            (country) => !parsedFavorites.some((fav) => fav.name === country.name)
          );
          showData(filteredData);
        } else {
          console.error("Erro na API");
        }
      })
      .catch((err) => {
        console.error(err + " erro na requisição");
      });
  }, []);

  useEffect(() => {
    search(searchQuery);
  }, [countries, favorites, searchQuery, selectRegion, selectFavRegion]);

  const showData = (data) => {
    const totalPopulation = data.reduce(
      (acc, country) => acc + country.population,
      0
    );
    setTotalPopulation(totalPopulation);
    setCountries(data);
    setFilteredCountries(data);
  };

  const calcTotalPopulation = (countries) => {
    const totalPopulation = countries.reduce(
      (acc, country) => acc + country.population,
      0
    );
    setTotalPopulation(totalPopulation);
  };

  const calcTotalFavPopulation = (favorites) => {
    const totalFavPopulation = favorites.reduce(
      (acc, country) => acc + country.population,
      0
    );
    setTotalFavPopulation(totalFavPopulation);
  };

  const addToFavorites = (countryIndex) => {
    const updatedCountries = [...filteredCountries];
    const countryToAdd = updatedCountries.splice(countryIndex, 1)[0];
    setFilteredCountries(updatedCountries);
    setCountries((prev) => prev.filter((c) => c !== countryToAdd));
    const newFavorites = [...favorites, countryToAdd].sort((a, b) => a.name.localeCompare(b.name));
    setFavorites(newFavorites);
    setTotalFavPopulation((prev) => prev + countryToAdd.population);
    calcTotalPopulation(updatedCountries);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (countryIndex) => {
    const updatedFavorites = [...favorites];
    const countryToRemove = updatedFavorites.splice(countryIndex, 1)[0];
    setFavorites(updatedFavorites);
    const updatedCountries = [...countries, countryToRemove].sort((a, b) => a.name.localeCompare(b.name));
    setCountries(updatedCountries);
    setFilteredCountries(updatedCountries);
    setTotalFavPopulation((prev) => prev - countryToRemove.population);
    setSelectedRegion("");
    setSelectedFavRegion("");
    calcTotalPopulation(updatedCountries);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const regionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    search(searchQuery, region, selectFavRegion);
  };

  const favRegionChange = (e) => {
    const region = e.target.value;
    setSelectedFavRegion(region);
    search(searchQuery, selectRegion, region);
  };

  const deleteAll = () => {
    const updatedCountries = [...countries, ...favorites].sort((a, b) => a.name.localeCompare(b.name));
    setFavorites([]);
    setCountries(updatedCountries);
    setFilteredCountries(updatedCountries);
    setTotalFavPopulation(0);
    setSelectedRegion("");
    setSelectedFavRegion("");
    localStorage.setItem("favorites", JSON.stringify([]));
    calcTotalPopulation(updatedCountries);

    let modal = document.querySelector('.modal');
    modal.style.display = "none";
    clearSearch()
  };

  const modalAppear = (e) => {
    e.preventDefault();
    let modal = document.querySelector('.modal');
    modal.style.display = "block";
  };

  const closeModal = () => {
    let modal = document.querySelector('.modal');
    modal.style.display = "none";
  };

  const search = (query, region = selectRegion, favRegion = selectFavRegion) => {
    setSearchQuery(query);
    let filteredCountriesList = countries;
    let filteredFavoritesList = favorites;

    if (region) {
      filteredCountriesList = filteredCountriesList.filter((country) => country.region === region);
    }

    if (favRegion) {
      filteredFavoritesList = filteredFavoritesList.filter((country) => country.region === favRegion);
    }

    if (query) {
      filteredCountriesList = filteredCountriesList.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase())
      );
      filteredFavoritesList = filteredFavoritesList.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredCountries(filteredCountriesList);
    setFilteredFavorites(filteredFavoritesList);
    calcTotalPopulation(filteredCountriesList);
    calcTotalFavPopulation(filteredFavoritesList);
  };
  const clearSearch = ()=>{
    document.getElementById('search-item').value = ""
    setSearchQuery("")
  }
  return (

    <main>

      <div className="modal">
        <div className="center">
          <h2>Tem certeza que deseja excluir todos os favoritos?</h2>
          <button onClick={closeModal}>Cancelar</button>
          <button style={{ color: "red"}} onClick={deleteAll}>Excluir</button>
        </div>
      </div>

      <div className="container">
        <div className="mainTable">
          <h2 id="total-countries">Países ({filteredCountries.length})</h2>
          <h3 id="total-population">
            População Total: {totalPopulation.toLocaleString()}
          </h3>
          <label> Selecione o continente
            <select value={selectRegion} onChange={regionChange}>
              <option value="">Todos</option>
              <option value="Africa">África</option>
              <option value="Americas">América</option>
              <option value="Asia">Ásia</option>
              <option value="Europe">Europa</option>
              <option value="Oceania">Oceania</option>
              <option value="Polar">Antártica</option>
            </select>
          </label>

          <table id="mainTable">
            <tbody className="countries">
              {filteredCountries.map((country, index) => (
                <tr key={index} id="countriesList">
                  <td className="icon">
                    <i
                      className="fa fa-plus-circle"
                      onClick={() => addToFavorites(index)}
                    ></i>
                  </td>
                  <td className="imgCountry">
                    <img
                      src={country.flag}
                      alt={`Bandeira de ${country.flag}`}
                    />
                  </td>
                  <td className="info">
                    <h3>({country.name})</h3>
                    <h3>{country.population.toLocaleString()}</h3>
                    <h3>Àrea: {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}</h3>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="search">
          <form>
            <i className="fas fa-search"></i>
            <input
              type="text"
              name=""
              id="search-item"
              placeholder="Busque aqui"
              onKeyUp={(e) => search(e.target.value)}
            />
            <span onClick={clearSearch} style={{cursor:"pointer"}} id="searchClose"><i  className="fas fa-times-circle"></i></span>
          </form>
        </div>

        <div className="fav" style={{ margin: "20px 0" }}>
          <h2>Favoritos ({favorites.length})</h2>
          <h3>População Total: {totalFavPopulation.toLocaleString()}</h3>
          <label> Selecione o continente
            <select value={selectFavRegion} onChange={favRegionChange}>
              <option value="">Todos</option>
              <option value="Africa">África</option>
              <option value="Americas">América</option>
              <option value="Asia">Ásia</option>
              <option value="Europe">Europa</option>
              <option value="Oceania">Oceania</option>
              <option value="Polar">Antártica</option>
            </select>
          </label>
          <button onClick={modalAppear}><i className="fas fa-trash"></i></button>
          <table id="favTable">
            <tbody className="favorites">
              {filteredFavorites.map((country, index) => (
                <tr key={index}>
                  <td className="icon">
                    <i
                      className="fa fa-minus-circle"
                      onClick={() => removeFromFavorites(index)}
                    ></i>
                  </td>
                  <td className="imgCountry">
                    <img
                      src={country.flag}
                      alt={`Bandeira de ${country.flag}`}
                    />
                  </td>
                  <td className="info">
                    <h3>({country.name})</h3>
                    <h3>{country.population.toLocaleString()}</h3>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Main;
