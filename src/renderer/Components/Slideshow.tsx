import { ImageList, ImageListItem } from '@mui/material';
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import { useHttpContext } from '../Services/http/HttpContext';
import Carousel from 'react-material-ui-carousel';

export default function Slideshow(props: any) {
  const { moddedInstall } = props;
  const { baseUrl } = useHttpContext();
  const showcaseUrl = moddedInstall
    ? `${baseUrl}/Showcase_Modded`
    : `${baseUrl}/Showcase_Unmodded`;

  const directoryQuery = GetDirectoryFileQuery();
  const images = moddedInstall
    ? directoryQuery?.data?.showcase_modded
    : directoryQuery?.data?.showcase_unmodded;

  const imageStyles = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  };

  return (
    <ImageList rowHeight={400} cols={1}>
      {images && (
        <Carousel
          autoPlay
          interval={30000}
          navButtonsAlwaysInvisible
          indicatorIconButtonProps={{
            style: {
              display: 'none',
            },
          }}
          stopAutoPlayOnHover={false}
        >
          {images.map((image: string, index: number) => (
            <ImageListItem key={index}>
              <img
                style={imageStyles}
                src={`${showcaseUrl}/${image}`}
                alt=""
                decoding="async"
                crossOrigin="anonymous"
              />
            </ImageListItem>
          ))}
        </Carousel>
      )}
    </ImageList>
  );
}
