import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function About() {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">About</Typography>
      </Breadcrumbs>
      <Typography gutterBottom variant="h3">
        About
      </Typography>
      <Typography align="left">
        <br />
        This is a prove-of-concept (POC) application for library application
        that is built with microservice architecture.
      </Typography>
      <Typography align="left">The microservice consists of:</Typography>
      <Typography align="left" component={'span'}>
        <ul>
          <li>Book Service</li>
          <li>Customer Service</li>
          <li>Borrowing Service</li>
          <li>Payment Service</li>
          <li>View Service</li>
        </ul>
      </Typography>
      <Typography align="left">Tech stacks:</Typography>
      <Typography align="left" component={'span'}>
        <ul>
          <li>
            Frontend:&nbsp;
            <a
              href="https://react.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React
            </a>
          </li>
          <li>
            Backend:&nbsp;
            <a
              href="https://nestjs.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NestJS
            </a>
          </li>
          <li>
            Message broker:&nbsp;
            <a
              href="https://www.rabbitmq.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              RabbitMQ
            </a>
          </li>
          <li>
            Build system:&nbsp;
            <a
              href="https://turbo.build/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Turborepo
            </a>
          </li>
          <li>
            CI platform:&nbsp;
            <a
              href="https://github.com/features/actions"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Actions
            </a>
          </li>
        </ul>
      </Typography>
    </>
  );
}

export default About;
