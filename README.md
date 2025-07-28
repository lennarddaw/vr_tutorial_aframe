# 🥽 VR Tutorial - Interactive Cube Collection

[![VR Platform](https://img.shields.io/badge/VR-Meta%20Quest%20%7C%20Pico%204-blue)](https://aframe.io/)
[![A-Frame](https://img.shields.io/badge/A--Frame-1.4.0-orange)](https://aframe.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Education](https://img.shields.io/badge/Education-STEM-purple)](https://github.com/)

An **educational VR application** built with A-Frame for teaching web-based VR development. Students collect colored cubes in sequence while learning HTML, JavaScript, and 3D programming concepts.

## ✨ Features

- 🎯 **Progressive Tutorial System** - Guided cube collection in sequence
- 🎮 **Cross-Platform Support** - Desktop, VR headsets, and mobile
- 📚 **Educational Focus** - Designed for STEM curriculum integration
- 🛠️ **Easy Customization** - HTML/JavaScript for extensibility
- 🚀 **Zero Installation** - Runs directly in web browsers

## 🚀 Quick Start

### 1. Setup
```bash
git clone https://github.com/your-username/vr-tutorial.git
cd vr-tutorial
```

### 2. Run Locally
```bash
# Open index.html in browser (Chrome/Firefox recommended)
# Or serve with local server:
python -m http.server 8000
```

### 3. VR Mode
- **Meta Quest/Pico**: Open browser → Load file → "Enter VR"
- **Desktop**: Mouse click to interact
- **Mobile**: Touch to interact

## 🎮 How It Works

1. **Blue Cube** - Point and trigger to collect
2. **Red Cube** - Appears after blue cube collection
3. **Green Cube** - Third in sequence
4. **Yellow Cube** - Final cube completes tutorial
5. **Completion** - Success feedback and restart option

## 🛠️ Technical Requirements

### Minimum Requirements
- **Browser**: Chrome 70+, Firefox 65+, Edge 79+
- **VR Headsets**: Meta Quest 1/2/3, Pico 3/4, HTC Vive, Oculus Rift
- **Mobile**: Android 7+, iOS 11+

### Technology Stack
- **A-Frame 1.4.0** - VR framework
- **WebXR API** - VR hardware access
- **HTML5/CSS3** - Structure and styling
- **JavaScript ES6+** - Interaction logic

## 📁 Project Structure

```
vr-tutorial/
├── index.html          # Main VR application
├── README.md           # Documentation
├── LICENSE             # MIT license
├── docs/               # Additional documentation
└── examples/           # Extension examples
```

## 🎓 For Educators

### Learning Objectives
- **3D Programming**: Coordinate systems and spatial thinking
- **Web Technologies**: HTML, CSS, JavaScript fundamentals
- **VR Development**: A-Frame framework and WebXR APIs
- **Problem Solving**: Debugging and code modification

### Classroom Integration
```javascript
// Week 1: HTML Basics - modify colors and positions
<a-box color="blue" position="0 1 -3"></a-box>

// Week 2: JavaScript Events - add interactivity
cube.addEventListener('click', function() {
    console.log('Student programmed this!');
});

// Week 3: Custom Features - creative extensions
function createRandomCube() {
    // Student-designed functionality
}
```

### Assessment Rubric
- **Basic**: Runs in browser, minor modifications made
- **Intermediate**: JavaScript functions added, new objects created
- **Advanced**: Custom levels designed, innovative features implemented

## 🔧 Customization

### Adding New Cubes
```html
<a-entity id="purple-cube"
          class="interactive-cube"
          position="4 1 -3"
          material="color: purple">
</a-entity>
```

### Modifying Sequence
```javascript
const cubeSequence = ['blue-cube', 'red-cube', 'green-cube', 'yellow-cube'];
// Add your cubes here
```

### Adding Sound Effects
```html
<a-assets>
    <audio id="success" src="success.mp3"></audio>
</a-assets>
```

## 🌐 Deployment

### GitHub Pages
```bash
1. Push to GitHub repository
2. Enable Pages in repository settings
3. Share URL: https://username.github.io/vr-tutorial/
```

### Alternative Hosting
- **Netlify**: Drag & drop deployment
- **Vercel**: Git integration
- **Local Server**: `python -m http.server 8000`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| VR mode not working | Use HTTPS, check headset connection |
| Cubes not clickable | Verify `class="interactive-cube"` attribute |
| Poor performance | Reduce quality settings, disable shadows |
| Audio not playing | Ensure user interaction before audio |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

### Development Guidelines
- **Code Style**: ES6+, semantic HTML, documented functions
- **Testing**: Verify on desktop and VR before submitting
- **Documentation**: Update README for new features

## 📚 Resources

- **[A-Frame Documentation](https://aframe.io/docs/)** - Official framework docs
- **[A-Frame School](https://aframe.io/aframe-school/)** - Interactive tutorials
- **[WebXR Samples](https://immersive-web.github.io/webxr-samples/)** - Advanced examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [A-Frame Team](https://aframe.io/) for the excellent VR framework
- [Mozilla](https://mozilla.org/) for pioneering web VR
- Educational community for feedback and suggestions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/vr-tutorial/issues)
- **Documentation**: See `docs/` folder for detailed guides
- **Community**: Join the A-Frame Discord for help

---

**Built with ❤️ for education and open source**

[![A-Frame](https://img.shields.io/badge/Built%20with-A--Frame-orange)](https://aframe.io/)
[![Education](https://img.shields.io/badge/Made%20for-Education-blue)](https://github.com/)
[![Open Source](https://img.shields.io/badge/❤️-Open%20Source-green)](https://github.com/)
