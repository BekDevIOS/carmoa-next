import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';

interface EventData {
  eventTitle: string;
  city: string;
  description: string;
  imageSrc: string;
}

const eventsData: EventData[] = [
  {
    eventTitle: 'CarMoa Auto Parts Expo 2025',
    city: 'Seoul',
    description: 'Korea’s first mini auto parts expo with live mechanic demos and tool showcases.',
    imageSrc: '/img/events/image1.png',
  },
  {
    eventTitle: 'CarMoa Premium Car Care Festival',
    city: 'Busan',
    description: 'Experience ceramic coating, foam washing, and premium car detailing workshops.',
    imageSrc: '/img/events/image2.png',
  },
  {
    eventTitle: 'Used Car Inspection Day',
    city: 'Daegu',
    description: 'Free inspection including battery check, brake test, and diagnostic scanning.',
    imageSrc: '/img/events/image3.png',
  },
  {
    eventTitle: 'Fast & Clean Wash Pop-Up',
    city: 'Incheon',
    description: 'A fun foam wash festival with interior sterilizing and free car perfume giveaways.',
    imageSrc: '/img/events/image4.png',
  },
];

const EventCard = ({ event }: { event: EventData }) => {
  return (
    <Box className="event-card">
      <img src={event?.imageSrc} alt={event?.eventTitle} />

      <Box className="gradient-overlay" />

      <Box className="content">
        <Typography className="city">{event.city}</Typography>
        <Typography className="title">{event.eventTitle}</Typography>
      </Box>

      <Box className="hover-layer">
        <Typography className="hover-description">{event.description}</Typography>
        <Button className="hover-btn">Learn More →</Button>
      </Box>
    </Box>
  );
};

const Events = () => {
  const device = useDeviceDetect();

  if (device === 'mobile') {
    return (
      <Stack className="events">
        <Stack className="container">
          <Stack className="section-header">
            <Typography variant="h2" className="main-title">
              <span className="title-highlight">EVENTS</span>
            </Typography>
          </Stack>
          <Swiper
            className="events-swiper mobile"
            slidesPerView={1.1}
            spaceBetween={18}
            centeredSlides
            modules={[Autoplay]}
            autoplay={{ delay: 2600, disableOnInteraction: false }}
          >
            {eventsData.map((event) => (
              <SwiperSlide key={event.eventTitle} className="event-slide-mobile">
                <Box className="event-card mobile">
                  <img src={event?.imageSrc} alt={event?.eventTitle} />
                  <Box className="gradient-overlay" />
                  <Box className="content">
                    <Typography className="city">{event.city}</Typography>
                    <Typography className="title">{event.eventTitle}</Typography>
					<Typography className="description">{event.description}</Typography>
					<Button className="cta" size="small">Learn More</Button>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className="events">
      <Stack className="container">
        <Stack className="section-header">
          <Typography variant="h2" className="main-title">
            <span className="title-highlight">EVENTS</span>
          </Typography>
          <Typography variant="body1" className="subtitle">
            Upcoming events you shouldn't miss!
          </Typography>
        </Stack>

        <Stack className="card-grid">
          {eventsData.map((event) => (
            <EventCard event={event} key={event.eventTitle} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Events;
