import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";
import { Icon } from '@iconify/react';

import AddHeroDialog from "src/components/productsModels/AddHeroModel";

interface HeroType {
  _id: string;
  title: string;
  desc: string;
  image: string;
}

export default function Hero() {
  const [heroes, setHeroes] = useState<HeroType[]>([]);
  const [openHero, setOpenHero] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedHero, setSelectedHero] = useState<HeroType | null>(null);

  // Fetch all heroes
  const getAllHeroes = async () => {
    try {
      const response = await axios.get("/auth/get-hero", {
        headers: { "Content-Type": "application/json" },
      });
      if (response?.data?.success) {
        setHeroes(response.data.data);
      } else {
        toast.error("Failed to fetch heroes.");
      }
    } catch (e) {
      console.error("Error fetching heroes:", e);
      toast.error("Error fetching heroes.");
    }
  };

  useEffect(() => {
    getAllHeroes();
  }, []);

  // Handle delete hero
  const handleDeleteHero = async () => {
    if (!selectedHero) return;
    try {
      const response = await axios.delete(`/auth/delete-hero/${selectedHero._id}`);
      if (response?.data?.success) {
        toast.success("Hero deleted successfully!");
        setHeroes((prev) => prev.filter((hero) => hero._id !== selectedHero._id));
      } else {
        toast.error("Failed to delete hero.");
      }
    } catch (e) {
      console.error("Error deleting hero:", e);
      toast.error("Error deleting hero.");
    } finally {
      setOpenDelete(false);
      setSelectedHero(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Add Hero Button */}
      <Button
        variant="contained"
        onClick={() => setOpenHero(true)}
        sx={{ mb: 3 }}
      >
        Add Hero
      </Button>

      {/* Hero List */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {heroes.map((hero) => (
          <Card
            key={hero._id}
            sx={{
              width: 260,
              position: "relative",
              "&:hover .delete-btn": { opacity: 1 },
            }}
          >
            {/* Image */}
            <CardMedia
              component="img"
              height="160"
              image={hero.image}
              alt={hero.title}
            />

            {/* Delete button on hover */}
            <IconButton
              className="delete-btn"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                opacity: 0,
                transition: "opacity 0.3s",
                "&:hover": { bgcolor: "error.main" },
              }}
              onClick={() => {
                setSelectedHero(hero);
                setOpenDelete(true);
              }}
            >
              <Icon icon="mdi:delete" />
            </IconButton>

            {/* Content */}
            <CardContent>
              <Typography variant="h6">{hero.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {hero.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add Hero Dialog */}
      <AddHeroDialog
        open={openHero}
        onClose={() => setOpenHero(false)}
        onSuccess={getAllHeroes}
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedHero?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="inherit">
            No
          </Button>
          <Button onClick={handleDeleteHero} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
