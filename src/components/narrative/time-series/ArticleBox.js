import * as React from 'react';
import {Card, CardContent, Divider, Link, Typography} from '@mui/material';
import PropTypes from 'prop-types';

const ArticleLink = ({href, ...props}) => {
  return (
    <Link
      href={href}
      rel="noopener"
      target="_blank"
      {...props}
    >
      {props.children}
    </Link>
  )
};

const ArticleBox = ({article, onDismiss, ...props}) => {
  return (
    <Card
      raised
      sx={{maxWidth: 'min(100vw, 30rem)'}}
      onClick={() => onDismiss()}
      {...props}
    >
      <CardContent sx={{p: 1, '&:last-child': {pb: 1}}}>
        <ArticleLink href={`/api/text/${encodeURIComponent(article.id)}/redirect?target=self`} variant="subtitle2">
          {article.title}
          <Typography component="span" noWrap sx={{display: 'block'}} variant="body2">{article.url}</Typography>
        </ArticleLink>
        <Divider sx={{my: 1}}/>
        <Typography variant="body2" color="text.secondary">
          Published: {new Date(article.published).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {'Via: '}
          <ArticleLink href={`/api/text/${encodeURIComponent(article.id)}/redirect?target=source`}>
            {article.originates_title}
          </ArticleLink>
          {` (${article.originates_url})`}
        </Typography>
      </CardContent>
    </Card>
  );
}

ArticleBox.propTypes = {
  article: PropTypes
    .shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      published: PropTypes.string.isRequired,
      originates_title: PropTypes.string.isRequired,
      originates_url: PropTypes.string.isRequired
    })
    .isRequired,
  onDismiss: PropTypes.func.isRequired
};


export default ArticleBox;
