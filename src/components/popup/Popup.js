import { useEffect } from 'react';
import styled from 'styled-components';
import { PopupEpisodes } from './PopupEpisodes';
import { PopupHeader } from './PopupHeader';
import { PopupInfo } from './PopupInfo';

export function Popup({ settings: { visible, content = {} }, setSettings }) {
  const {
    name,
    gender,
    image,
    status,
    species,
    type,
    origin,
    location,
    episode: episodes
  } = content;

  // Закрытие попапа
  function togglePopup(e) {
    if (e.currentTarget !== e.target) {
      return;
    }

    setSettings((prevState) => ({
      ...prevState,
      visible: !prevState.visible
    }));
  }

  // Закрытие попапа при нажатии клавиши Esc
  useEffect(() => {
    function handleEscPress(e) {
      if (e.key === 'Escape') {
        setSettings((prevState) => ({
          ...prevState,
          visible: false
        }));
      }
    }

    // Закрытие попапа при клике на подложку
    function handleClickOutside(e) {
      if (e.target === e.currentTarget) {
        setSettings((prevState) => ({
          ...prevState,
          visible: false
        }));
      }
    }

    if (visible) {
      document.body.style.overflow = 'hidden'; // Отключаем скроллинг на фоне
      document.addEventListener('keydown', handleEscPress);
      document.addEventListener('click', handleClickOutside);
    } else {
      document.body.style.overflow = 'auto'; // Восстанавливаем скроллинг после закрытия
    }

    // Очистка событий при размонтировании
    return () => {
      document.removeEventListener('keydown', handleEscPress);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'auto'; // Восстанавливаем скроллинг
    };
  }, [visible, setSettings]);

  return (
    <PopupContainer visible={visible} onClick={togglePopup}>
      <StyledPopup>
        <CloseIcon onClick={togglePopup} />

        <PopupHeader
          name={name}
          gender={gender}
          image={image}
          status={status}
          species={species}
          type={type}
        />

        <PopupInfo origin={origin} location={location} />

        <PopupEpisodes episodes={episodes} />
      </StyledPopup>
    </PopupContainer>
  );
}

const PopupContainer = styled.div`
  position: fixed;
  z-index: 10;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100vh;
  color: #fff;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s, visibility 0.3s;

  ${({ visible }) =>
    visible &&
    `
      opacity: 1;
      visibility: initial;
      pointer-events: all;
    `}
`;

const StyledPopup = styled.div`
  position: relative;
  width: 40%;
  margin: 0 auto;
  height: auto;
  max-height: 90vh;
  margin-top: calc(10vh - 20px);
  background: #263750;
  border-radius: 15px;
  padding: 20px 40px;
  border: 2px solid #83bf46;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  ${window.screen.width < 930 && 'width: 80%'};
  ${window.screen.width < 600 && 'width: 95%'};
`;

const CloseIcon = styled.div`
  cursor: pointer;
  position: fixed;
  right: calc(30% - 10px);
  top: calc(10vh - 30px);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #83bf46aa;

  &:before,
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 20px;
    height: 2px;
    background: #fff;
  }

  &:before {
    left: 4.5px;
    transform: rotate(-45deg);
  }

  &:after {
    right: 4.5px;
    transform: rotate(45deg);
  }

  ${window.screen.width < 930 && 'right: calc(10% - 10px)'};
  ${window.screen.width < 600 && 'right: calc(3% - 10px)'};
`;
