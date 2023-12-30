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
        The application is a proof of concept (POC) library application designed
        in a
        <a
          href="https://microservices.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;microservice&nbsp;
        </a>
        architecture. The application is built with
        <a
          href="https://www.typescriptlang.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;Typescript&nbsp;
        </a>
        organized in a
        <a
          href="https://monorepo.tools/"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;monorepo&nbsp;
        </a>
        project setup.
      </Typography>
      <br />
      <Typography align="left">
        The microservice app consists of the following services:
      </Typography>
      <Typography align="left" component={'span'}>
        <ul>
          <li>Book Service</li>
          <li>Customer Service</li>
          <li>Borrowing Service</li>
          <li>Payment Service</li>
          <li>Notification Service</li>
          <li>View Service</li>
        </ul>
      </Typography>
      <Typography align="left">
        For further details, please refer the{' '}
        <a
          href="https://github.com/ckng0221/library-app/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Readme
        </a>{' '}
        document in the{' '}
        <a
          href="https://github.com/ckng0221/library-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>{' '}
        page.
      </Typography>
      <Typography align="left">
        For contribution, please refer the{' '}
        <a
          href="https://github.com/ckng0221/library-app/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contribution Guide
        </a>
        .
      </Typography>
    </>
  );
}

export default About;
