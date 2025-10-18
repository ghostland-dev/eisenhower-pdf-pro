# 📊 Matrice d'Eisenhower - Gestionnaire de Tâches

Application web moderne pour organiser vos tâches selon la méthode d'Eisenhower : classez vos priorités selon l'urgence et l'importance.

## ✨ Fonctionnalités

- 🎯 **Classification automatique** : Ajoutez vos tâches et sélectionnez leur catégorie
- 📱 **Responsive** : Fonctionne parfaitement sur mobile, tablette et desktop
- 💾 **Sauvegarde automatique** : Vos tâches sont sauvegardées dans votre navigateur
- 📄 **Export PDF** : Générez un PDF professionnel de votre matrice
- 🎨 **Interface moderne** : Design épuré avec animations fluides
- 🔒 **Validation** : Protection contre les entrées invalides
- ♿ **Accessible** : Navigation au clavier et labels ARIA

## 🎨 Les 4 Quadrants

### 1. Urgent & Important (Vert)
**À FAIRE IMMÉDIATEMENT**
Tâches critiques nécessitant une attention immédiate.

### 2. Important mais Non Urgent (Bleu)
**À PLANIFIER**
Tâches importantes pour vos objectifs à long terme.

### 3. Urgent mais Non Important (Orange)
**À DÉLÉGUER**
Tâches urgentes mais qui peuvent être déléguées.

### 4. Ni Urgent Ni Important (Rose)
**À ÉLIMINER**
Distractions à minimiser ou éliminer.

## 🚀 Utilisation

1. **Ajouter une tâche** :
   - Tapez votre tâche dans le champ (max 500 caractères)
   - Sélectionnez la catégorie appropriée
   - Cliquez sur "Ajouter la tâche" ou pressez Entrée

2. **Supprimer une tâche** :
   - Survolez la tâche et cliquez sur l'icône poubelle

3. **Exporter en PDF** :
   - Cliquez sur "Exporter en PDF"
   - Le fichier sera téléchargé automatiquement

4. **Sauvegarder manuellement** :
   - Cliquez sur "Sauvegarder" pour forcer une sauvegarde

## 🛡️ Sécurité

- ✅ Validation Zod des entrées utilisateur
- ✅ Sanitization automatique (trim)
- ✅ Limite de caractères (500 max)
- ✅ Protection contre les entrées vides
- ✅ Gestion d'erreurs complète
- ✅ ErrorBoundary React

## 🎯 Technologies

- **React 18** - Framework UI moderne
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **shadcn/ui** - Composants UI
- **Zod** - Validation de schémas
- **jsPDF** - Génération de PDF
- **LocalStorage** - Persistance des données

## 📦 Installation locale

```bash
# Cloner le repository
git clone <YOUR_GIT_URL>

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build
```

## 🌐 Déploiement

### Via Lovable
1. Cliquez sur le bouton **Publish** en haut à droite
2. Votre app sera déployée automatiquement

### Via Vercel/Netlify
```bash
npm run build
# Déployez le dossier dist/
```

## 📱 PWA (Progressive Web App)

L'application peut être installée sur votre appareil :
- **iOS** : Safari > Partager > Ajouter à l'écran d'accueil
- **Android** : Chrome > Menu > Installer l'application

## 🎓 Méthode Eisenhower

Cette méthode de gestion du temps, créée par Dwight D. Eisenhower (34ème président des USA), aide à :
- Prioriser efficacement vos tâches
- Distinguer l'urgent de l'important
- Réduire le stress et améliorer la productivité
- Mieux déléguer et éliminer les distractions

## 🔧 Structure du projet

```
src/
├── components/
│   ├── EisenhowerMatrix.tsx   # Composant principal
│   ├── QuadrantCard.tsx        # Carte de quadrant
│   ├── TaskInput.tsx           # Formulaire d'ajout
│   ├── TaskItem.tsx            # Élément de tâche
│   └── ErrorBoundary.tsx       # Gestion d'erreurs
├── lib/
│   ├── pdfGenerator.ts         # Génération PDF
│   ├── storage.ts              # LocalStorage
│   ├── validation.ts           # Schémas Zod
│   └── utils.ts                # Utilitaires
├── types/
│   └── task.ts                 # Types TypeScript
└── pages/
    └── Index.tsx               # Page principale
```

## 🐛 Débogage

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur
2. Videz le cache et LocalStorage
3. Rechargez la page

## 📄 Licence

Ce projet est open source et disponible sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou suggestion :
- Consultez la [documentation Lovable](https://docs.lovable.dev/)
- Rejoignez la [communauté Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

**Fait avec ❤️ avec Lovable**

[URL du projet](https://lovable.dev/projects/83c614c5-6f53-4290-9bd4-f0927aed19b8)
