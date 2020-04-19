import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import english from "retext-english";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import keywords from "retext-keywords";
import Link from "@material-ui/core/Link";
import mentions from "retext-syntax-mentions";
import nlp from "compromise";
import pos from "retext-pos";
import React from "react";
import retext from "retext";
import TextField from "@material-ui/core/TextField";
import toString from "nlcst-to-string";
import Typography from "@material-ui/core/Typography";
import urls from "retext-syntax-urls";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://nicholasnadeau.me/">
        Nicholas Nadeau
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Tagger() {
  const classes = useStyles();
  const inputProps = {
    readOnly: true,
  };
  const inputLabelProps = {
    shrink: true,
  };

  return (
    <Container maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>
          <TextField
            autoFocus
            fullWidth
            id="text"
            label="Text"
            margin="normal"
            multiline
            name="text"
            rows="10"
            variant="outlined"
            onChange={textInputEvent}
          />
          <TextField
            autoComplete="current-password"
            fullWidth
            id="keywords"
            inputProps={inputProps}
            InputLabelProps={inputLabelProps}
            label="Keywords"
            margin="normal"
            name="keywords"
            type="text"
          />
          <FormControlLabel
            control={<Checkbox id="isQuoted" color="primary" />}
            label="Quoted"
            onChange={textInputEvent}
          />
          <FormControlLabel
            control={<Checkbox id="isLowercase" color="primary" />}
            label="Lowercase"
            onChange={textInputEvent}
          />
        </form>
      </div>
    </Container>
  );
}

export default function App() {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h1" component="h1" gutterBottom align="center">
          Labell
        </Typography>
        <Typography component="h1" variant="h5" align="center">
          Enter text, get keywords
        </Typography>
        <Tagger />
      </Box>
      <Copyright />
    </Container>
  );
}

async function textInputEvent(event) {
  let text = document.getElementById("text").value;
  let words = await getKeywordsFromText(text);

  if (document.getElementById("isQuoted").checked) {
    words = words.map((x) => `"${x}"`);
  }
  if (document.getElementById("isLowercase").checked) {
    words = words.map((x) => x.toLowerCase());
  }

  words = words.join(", ");
  document.getElementById("keywords").value = words;
}

function getKeywordsFromText(text, maximum = 5) {
  return new Promise((resolve) => {
    retext()
      .use(english)
      .use(urls)
      .use(mentions)
      .use(pos)
      .use(keywords)
      .process(text, done);

    function done(err, file) {
      if (err) throw err;
      let words = file.data.keywords.map((x) => toString(x.matches[0].node));
      resolve(words);
    }
  });
}
