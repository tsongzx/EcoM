import {React, useEffect, useState} from 'react';
import { Grid, Paper, Typography, Card, CardContent, IconButton, Menu, MenuItem, Button, Container, Box, Stack } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { fetchLists, getRecentlyViewed, getCompanyFromRecentlyViewed, getFavouritesList, deleteList } from '../helper.js';
import { useNavigate } from 'react-router-dom';
import ListModal from './ListModal.jsx';

const IndustryPage = ({setListOfCompanies, setSelectedCompany}) => {
  const navigate = useNavigate();
    
  return (
    <></>
  );
}

export default IndustryPage;