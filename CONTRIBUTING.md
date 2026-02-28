# Contributing to KernelPlayJS

Thank you for your interest in contributing to KernelPlayJS! This document provides guidelines and information for contributors.

---

## 🌟 Ways to Contribute

### For Everyone
- 🐛 Report bugs and issues
- 💡 Suggest new features or improvements
- 📝 Improve documentation
- 🎮 Create example games and demos
- 💬 Help others in discussions and issues
- ⭐ Star the project and spread the word

### For Developers
- 🔧 Fix bugs and implement features
- ⚡ Performance optimizations
- 🧪 Write tests
- 📚 API documentation
- 🎨 Create components and systems

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git
- Basic understanding of JavaScript ES6+
- Familiarity with game engine concepts (helpful but not required)

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/kernelplay-js.git
cd kernelplay-js

# 3. Add upstream remote
git remote add upstream https://github.com/Soubhik1000/kernelplay.git

# 4. Install dependencies
npm install

# 5. Create a branch for your work
git checkout -b feature/your-feature-name
```

### Project Structure

```
kernelplay-js/
├── src/
│   ├── core/           # Core engine systems
│   │   ├── Game.js
│   │   ├── Loop.js
│   │   ├── Scene.js
│   │   └── Entity.js
│   ├── components/     # Built-in components
│   │   ├── TransformComponent.js
│   │   ├── ColliderComponent.js
│   │   └── ...
│   ├── systems/        # Engine systems
│   │   ├── physics/
│   │   └── rendering/
│   └── utils/          # Utilities
├── examples/           # Example games
├── docs/              # Documentation
└── tests/             # Test files
```

---

## 🎯 Priority Areas

### High Priority
1. **Audio System** - Complete Web Audio API integration
2. **Particle System** - Optimized particle effects with pooling
3. **Documentation** - API docs, tutorials, examples
4. **Example Games** - Showcase engine capabilities

### Medium Priority
5. **Scene Serialization** - Save/load game state
6. **Continuous Collision** - Prevent tunneling at high speeds
7. **Physics Constraints** - Joints, springs, ropes
8. **UI System** - GUI components with raycasting

### Low Priority
9. **Animation System** - Sprite animations, tweening
10. **Tilemap Support** - Efficient tile-based rendering
11. **Mobile Optimization** - Touch input, performance
12. **Editor Tools** - Visual scene editor

---

## 📋 Contribution Guidelines

### Code Style

**JavaScript Standards**
- Use ES6+ features (classes, arrow functions, destructuring)
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- Meaningful variable names (camelCase)

**Good Example:**
```javascript
class PlayerController extends ScriptComponent {
  constructor(speed = 200) {
    super();
    this.speed = speed;
    this.jumpForce = 500;
  }

  update(dt) {
    const rb = this.entity.getComponent('rigidbody2d');
    
    if (Keyboard.isDown('ArrowRight')) {
      rb.velocity.x = this.speed;
    }
  }
}
```

**Bad Example:**
```javascript
class PC extends ScriptComponent {
    constructor(s = 200) {
        super()
        this.s = s
        this.jf = 500
    }
    update(dt){
      var rb=this.entity.getComponent("rigidbody2d")
      if(Keyboard.isDown("ArrowRight"))rb.velocity.x=this.s
    }
}
```

### Performance Guidelines

**✅ Do:**
- Use component registries for system iteration
- Implement spatial partitioning for large datasets
- Cache references to frequently accessed components
- Use dirty flags to skip unnecessary calculations
- Profile before optimizing

**❌ Don't:**
- Use `entity.getComponent()` in tight loops
- Create new objects in update loops
- Use O(n²) algorithms without spatial partitioning
- Ignore memory allocation patterns

**Example - Optimized System:**
```javascript
// ✅ Good - Direct registry iteration
_physicsStep(dt) {
  for (const rb of this._rigidbody2D) {
    rb.integrate(dt, this.gravity);
  }
}

// ❌ Bad - Entity filtering
_physicsStep(dt) {
  for (const entity of this.entities) {
    const rb = entity.getComponent('rigidbody2d');
    if (rb) rb.integrate(dt, this.gravity);
  }
}
```

### Component Design Principles

**Components should:**
1. Store data only (no game logic)
2. Have an `init()` method for setup
3. Cache frequently used references
4. Use dirty flags for expensive calculations
5. Be composable and reusable

**Example - Well-Designed Component:**
```javascript
export class HealthComponent extends Component {
  constructor(maxHealth = 100) {
    super();
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this._isDirty = true;
  }

  init() {
    // Cache references
    this.transform = this.entity.getComponent('transform');
    this.renderer = this.entity.getComponent('renderer');
  }

  takeDamage(amount) {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
    this._isDirty = true;
    
    if (this.currentHealth === 0) {
      this.entity.destroy();
    }
  }

  heal(amount) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    this._isDirty = true;
  }

  get healthPercentage() {
    return this.currentHealth / this.maxHealth;
  }
}
```

### System Design Principles

**Systems should:**
1. Operate on component arrays directly
2. Be single-responsibility
3. Have O(n) or better complexity
4. Use spatial partitioning for spatial queries
5. Be stateless when possible

---

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- ComponentTest.js

# Run with coverage
npm run test:coverage
```

### Writing Tests
```javascript
import { Entity, TransformComponent } from '../src/index.js';

describe('TransformComponent', () => {
  it('should initialize with default values', () => {
    const entity = new Entity();
    const transform = new TransformComponent();
    entity.addComponent('transform', transform);
    
    expect(transform.position.x).toBe(0);
    expect(transform.position.y).toBe(0);
    expect(transform.scale.x).toBe(1);
  });

  it('should update position correctly', () => {
    const entity = new Entity();
    const transform = new TransformComponent();
    entity.addComponent('transform', transform);
    
    transform.position.x = 100;
    expect(transform.position.x).toBe(100);
    expect(transform._dirty).toBe(true);
  });
});
```

---

## 📝 Documentation

### Code Comments
```javascript
/**
 * Applies physics integration for this rigidbody.
 * Updates velocity based on forces and updates position.
 * 
 * @param {number} dt - Delta time in seconds
 * @param {number} gravity - Gravity acceleration (pixels/s²)
 */
integrate(dt, gravity) {
  if (this.isKinematic) return;
  
  // Apply gravity
  if (this.useGravity) {
    this.velocity.y += gravity * this.gravityScale * dt;
  }
  
  // Apply drag
  this.velocity.x *= (1 - this.drag);
  this.velocity.y *= (1 - this.drag);
  
  // Update position
  this.transform.position.x += this.velocity.x * dt;
  this.transform.position.y += this.velocity.y * dt;
}
```

### API Documentation
- Document all public methods and properties
- Include parameter types and return values
- Provide usage examples
- Explain edge cases and gotchas

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Check code style**
   ```bash
   npm run lint
   ```

4. **Update documentation** if needed

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update
- [ ] Breaking change

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes

## Performance Impact
- Benchmark results (if applicable)
- Memory usage change (if applicable)

## Screenshots/Demo
(if applicable)

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainer reviews code
2. Address feedback in new commits
3. Once approved, maintainer will merge
4. Your contribution will be included in the next release!

---

## 🐛 Bug Reports

### Good Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Create entity with...
2. Add component...
3. Call method...
4. See error

**Expected behavior**
What you expected to happen

**Actual behavior**
What actually happened

**Code Sample**
```javascript
// Minimal code to reproduce
const entity = new Entity();
// ...
```

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- KernelPlayJS version: [e.g., 0.2.0]

**Additional context**
Any other information
```

---

## 💡 Feature Requests

### Good Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other approaches you've thought about.

**API Design (if applicable)**
```javascript
// Proposed API
entity.addComponent('audio', new AudioComponent({
  source: 'sound.mp3',
  volume: 0.8
}));
```

**Use Cases**
Real-world scenarios where this would be useful.

**Additional context**
Any other information.
```

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation
- Given contributor badge (for significant contributions)

---

## 📜 Code of Conduct

### Our Standards

**Positive behavior:**
- Being respectful and inclusive
- Accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behavior:**
- Harassment or discriminatory language
- Personal attacks or trolling
- Spam or off-topic discussions
- Any other unprofessional conduct

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to: conduct@kernelplay.dev

---

## 📞 Communication

### Channels

- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - General questions, ideas
- **Discord** - Real-time chat, help
- **Email** - dev@kernelplay.dev

### Response Times

- Bug reports: 1-3 days
- Feature requests: 1-7 days
- Pull requests: 2-7 days
- Security issues: 24 hours

---

## 🎓 Learning Resources

### Engine Architecture
- [ECS Pattern Explained](docs/architecture/ecs.md)
- [Spatial Grid Optimization](docs/architecture/spatial-grid.md)
- [Rendering Pipeline](docs/architecture/rendering.md)

### Game Development
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [Real-Time Collision Detection](https://realtimecollisiondetection.net/)
- [Game Engine Architecture](https://www.gameenginebook.com/)

### JavaScript Performance
- [V8 Optimization Tips](https://v8.dev/docs)
- [JavaScript Performance Guide](https://developer.mozilla.org/docs/Web/Performance)

---

## ❓ FAQ

**Q: I'm new to game engines. Can I still contribute?**  
A: Absolutely! Start with documentation, examples, or bug fixes. We're happy to mentor new contributors.

**Q: How long does it take to get a PR reviewed?**  
A: Usually 2-7 days. Complex PRs may take longer.

**Q: Can I work on multiple issues at once?**  
A: We recommend focusing on one issue at a time for better quality.

**Q: Do I need to sign a CLA?**  
A: No, we use MIT license. Your contributions are yours.

**Q: Can I use AI tools (ChatGPT, Copilot) to help?**  
A: Yes, but you're responsible for code quality and correctness.

**Q: What if my PR gets rejected?**  
A: Don't worry! We'll provide feedback on how to improve it.

---

## 🙏 Thank You!

Every contribution, no matter how small, helps make KernelPlayJS better. We appreciate your time and effort!

**Happy Coding!** 🚀
