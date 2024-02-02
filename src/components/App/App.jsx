import { useEffect, useState } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { MainContainer } from './App.styled';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Photos } from 'services/Photos.service';
import { Error } from '../Error/Error';
import Loader from 'components/Loader/Loader';
import { Modal } from '../Modal/Modal';
import { ButtonLoadMore } from '../ButtonLoadMore/ButtonLoadMore';

export const App = () => {
  const [searchedPhotos, setSearchedPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [saveSearch, setSaveSearch] = useState('');
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhoto, setModalPhoto] = useState('');
  const [counter, setCounter] = useState(1);

  const savePhotos = (photos, typeSave) => {
    if (typeSave === 'update') {
      setSearchedPhotos([...searchedPhotos, ...photos]);
    } else if (typeSave === 'get') {
      setSearchedPhotos([...photos]);
    }
  };

  // Request content
  // (Search = query in string, Page = Pagination of load)
  const requestPhotos = async (search = '', page = 1, typeRequest = 'get') => {
    setLoading(true);
    setSaveSearch(search);
    setPageNum(page);
    try {
      // request
      const gallery = await Photos(search, page);
      savePhotos(gallery.hits, typeRequest);
    } catch (error) {
      setError(true);
      console.log('Download error someone parameter is incorrect', error);
    } finally {
      // ends loading animation
      setLoading(false);
    }
  };

  // Request when the user click in the 'LoadMore' button
  const loadMore = () => {
    requestPhotos(saveSearch, pageNum + 1, 'update');
  };

  const enlargePhoto = largePhoto => {
    setModalOpen(true);
    setModalPhoto(largePhoto);
  };

  const closeModal = e => {
    if (modalOpen && e.key === 'Escape') return setModalOpen(false);
  };

  const identifyPhoto = e => {
    enlargePhoto(e.target.getAttribute('data-largeImage'));
  };

  useEffect(() => {
    setCounter(counter + 1);
    requestPhotos();

    document.addEventListener('keydown', e => closeModal(e));
  }, []);


  return (
    <>
      <SearchBar searchEngine={requestPhotos}></SearchBar>
      <main>
        <MainContainer className="container">
          {loading && <Loader></Loader>}
          {error ? (
            <Error></Error>
          ) : (
            <ImageGallery
              photosGallery={searchedPhotos}
              identifyImg={identifyPhoto}
            ></ImageGallery>
          )}
          <ButtonLoadMore request={loadMore}></ButtonLoadMore>
        </MainContainer>
      </main>
      {modalOpen && modalPhoto !== null && (
        <Modal photoURL={modalPhoto}></Modal>
      )}
    </>
  );
};
