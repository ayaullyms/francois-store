const express = require('express');
const router = express.Router();
const Fragrance = require('../models/Fragrance');
const authMiddleware = require('../middleware/authMiddleware');

// Получение всех ароматов с фильтрацией и сортировкой
router.get('/fragrances', async (req, res) => {
  try {
    let query = {};
    if (req.query.gender) query.gender = req.query.gender;

    let fragrances = await Fragrance.find(query);

    // Объединяем ароматы с одинаковыми именами, объединяя размеры
    let mergedFragrances = {};
    fragrances.forEach(frag => {
      if (!mergedFragrances[frag.name]) {
        mergedFragrances[frag.name] = { ...frag.toObject(), sizes: {} };
      }
      mergedFragrances[frag.name].sizes = { ...mergedFragrances[frag.name].sizes, ...frag.sizes };
    });

    let sortedFragrances = Object.values(mergedFragrances);

    // Сортировка (если переданы параметры sortBy и order)
    if (req.query.sortBy && req.query.order) {
      let { sortBy, order } = req.query;
      sortedFragrances.sort((a, b) => {
        if (sortBy === 'name') {
          return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortBy === 'price') {
          let priceA = Math.min(...Object.values(a.sizes));
          let priceB = Math.min(...Object.values(b.sizes));
          return order === 'asc' ? priceA - priceB : priceB - priceA;
        }
      });
    }

    res.json(sortedFragrances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получение информации об одном аромате
router.get('/fragrance/:id', async (req, res) => {
  try {
    const fragrance = await Fragrance.findById(req.params.id);
    if (!fragrance) return res.status(404).json({ message: 'Fragrance not found' });

    res.render('fragrance-details', { fragrance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Добавление нового аромата (только для админа)
router.post('/fragrance', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, brand, gender, scent, sizes, top_notes, longevity, sillage, season, image } = req.body;

    const newFragrance = new Fragrance({
      name,
      brand,
      gender,
      scent,
      sizes,
      top_notes,
      longevity,
      sillage,
      season,
      image
    });

    await newFragrance.save();
    res.status(201).json({ message: 'Fragrance added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Обновление информации об аромате (только для админа)
router.put('/fragrance/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedFragrance = await Fragrance.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedFragrance) return res.status(404).json({ message: 'Fragrance not found' });

    res.json({ message: 'Fragrance updated successfully', updatedFragrance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Удаление аромата (только для админа)
router.delete('/fragrance/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deletedFragrance = await Fragrance.findByIdAndDelete(req.params.id);
    if (!deletedFragrance) return res.status(404).json({ message: 'Fragrance not found' });

    res.json({ message: 'Fragrance deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
