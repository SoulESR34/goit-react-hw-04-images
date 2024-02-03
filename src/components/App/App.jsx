import { useEffect, useState } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { MainContainer } from './App.styled';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Photos } from 'services/Photos.service';
import { Error } from '../Error/Error';
import Loader from '../Loader/Loader';
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


  // Request content
  // (Search = query in string, Page = Pagination of load)

  // Request when the user click in the 'LoadMore' button
  const loadMore = () => {
    setPageNum(pageNum + 1)
  };

  const enlargePhoto = largePhoto => {
    setModalOpen(true);
    setModalPhoto(largePhoto);
  };

  const identifyPhoto = e => {
    enlargePhoto(e.target.getAttribute('data-largeImage'));
  };

  useEffect(() => {
    const closeModal = e => {
      if (modalOpen && e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', e => closeModal(e));

    return document.removeEventListener('keydown', e => closeModal(e));
  }, [modalOpen]);

  useEffect(()=>{
    const savePhotos = (photos) => {
      if (pageNum === 1) {
        setSearchedPhotos([...photos]);
      } else {
        setSearchedPhotos((sp) => [...sp, ...photos]);
      }
    };

    const requestPhotos = async(search, page = 1) => {
      setLoading(true);
      setPageNum(page);
      try {
        // request
        const gallery = await Photos(search, page);
        savePhotos(gallery.hits);
      } catch (error) {
        setError(true);
        console.log('Download error someone parameter is incorrect', error);
      } finally {
        // ends loading animation
        setLoading(false);
      }
    };

    requestPhotos(saveSearch, pageNum, setSearchedPhotos);
  }, [saveSearch, pageNum])

  const searchElements = (search) => {
    setSaveSearch(search)
    setPageNum(1)
  }

  return (
    <>
      <SearchBar searchEngine={searchElements}></SearchBar>
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
