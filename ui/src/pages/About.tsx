import {
  BottomNavigation,
  BottomNavigationAction,
  Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

function About() {
  return (
    <>
      <Typography gutterBottom variant="h5">
        About
      </Typography>
      <Typography align="left">
        <br />
        This is a prove-of-concept (POC) application of a microservice
        application, with backend developed in NestJS and frontend developed in
        React.
      </Typography>
      <Typography align="left">The microservice consists of:</Typography>
      <Typography align="left">
        <ul>
          <li>Book Service</li>
          <li>Customer Service</li>
          <li>Borrowing Service</li>
          <li>Payment Service</li>
        </ul>
      </Typography>
      <br />
      <br />
      <BottomNavigation showLabels>
        <BottomNavigationAction label="GitHub" icon={<GitHubIcon />} />
      </BottomNavigation>
    </>
  );
}

export default About;
