# Deep License Demo Project

## Overview
This is a demonstration project that showcases **deep licenses** (sub-licenses or embedded licenses) in open source components.

## What are Deep Licenses?
Deep licenses are licenses found in transitive dependencies (dependencies of your dependencies). Unlike declared top-level licenses, these can be hidden several levels deep in your dependency tree.

## Project Dependencies and Their Deep Licenses

### 1. **Spring Boot Starter Web** (Apache 2.0)
   - **Direct License**: Apache License 2.0
   - **Deep Licenses**:
     - Spring Framework dependencies
     - Jakarta/Java EE libraries
     - Commons libraries (Apache 2.0)
     - Netty (Apache 2.0)

### 2. **Apache Commons Lang** (Apache 2.0)
   - **Direct License**: Apache License 2.0
   - **Deep Licenses**: Minimal, mostly self-contained

### 3. **Jackson Databind** (Apache 2.0)
   - **Direct License**: Apache License 2.0
   - **Deep Licenses**:
     - jackson-annotations (Apache 2.0)
     - jackson-core (Apache 2.0)

### 4. **SLF4J API** (MIT)
   - **Direct License**: MIT License
   - **Deep Licenses**: Minimal, core abstraction

### 5. **Logback Classic** (EPL 1.0 / LGPL 2.1)
   - **Direct License**: Dual Licensed (EPL 1.0 and LGPL 2.1)
   - **Deep Licenses**:
     - SLF4J API (MIT)
     - logback-core (EPL 1.0 / LGPL 2.1)

## Why Deep Licenses Matter

1. **Compliance Risk**: Hidden licenses may conflict with your project's licensing model
2. **Legal Obligations**: You need to understand all licenses in your dependency tree
3. **Policy Violations**: Certain license combinations may violate company policies
4. **Transparency**: Better visibility into actual licensing obligations

## Enabling Deep License Scanning with Black Duck

When using Black Duck Hub or Black Duck on Cloud:

1. Enable deep license data in your project configuration
2. Run a scan on this project
3. Review the BOM (Bill of Materials) with deep licenses enabled
4. Identify any licensing risks or conflicts

## Building the Project

```bash
mvn clean install
```

## Using Black Duck to Scan

```bash
# With Black Duck Hub Agent
mvn com.blackducksoftware.integration:hub-maven-plugin:4.0.0:inspect

# Or with Black Duck on Cloud
mvn com.synopsys.intelligence:synopsys-maven-plugin:latest:scan
```

## Key Takeaways

- Deep licenses are not always obvious from top-level dependencies
- Enabling deep license tracking can impact scan performance
- Managing deep licenses reduces licensing risks
- Regular compliance reviews help identify potential conflicts
- Documentation of all transitive licenses is important for audit trails

## Resources

- [Black Duck Deep Licenses Documentation](https://www.blackduck.com/)
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [MIT License](https://opensource.org/licenses/MIT)
- [EPL 1.0](https://www.eclipse.org/legal/epl-1.0/)
- [LGPL 2.1](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html)

